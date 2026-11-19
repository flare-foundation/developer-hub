package app

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"regexp"
	"strings"
	"time"
)

// pairs are the pairs the extension prices; each source names them its own way.
var pairs = []string{"BTC/USD", "ETH/USD", "FLR/USD"}

// sources are the APIs the extension trusts. They are constants of the code, so
// part of the attested image: the operator can't point the TEE elsewhere. The
// host is reached over TLS, verified against the CA bundle in the image.
var sources = []source{
	{
		name:  "coinbase",
		urls:  urls("https://api.coinbase.com/v2/prices/%s/spot", "BTC-USD", "ETH-USD", "FLR-USD"),
		price: coinbasePrice,
	},
	{
		name:  "kraken",
		urls:  urls("https://api.kraken.com/0/public/Ticker?pair=%s", "XBTUSD", "ETHUSD", "FLRUSD"),
		price: krakenPrice,
	},
	{
		name:  "bitstamp",
		urls:  urls("https://www.bitstamp.net/api/v2/ticker/%s/", "btcusd", "ethusd", "flrusd"),
		price: bitstampPrice,
	},
}

const (
	// decimals is the precision prices are given in: 8, as USD feeds commonly use
	decimals = 8
	// sourceTimeout bounds each source's answer; the job runs in the background, past the node's 2 s
	sourceTimeout = 5 * time.Second
	// maxBody caps a source's answer: it is untrusted input
	maxBody = 64 << 10
)

// source is one API: its URL for each pair, and how to read the price from its answer.
type source struct {
	name  string
	urls  map[string]string
	price func(body []byte) (string, error) // a decimal string
}

func urls(format string, symbols ...string) map[string]string {
	m := make(map[string]string, len(pairs))
	for i, p := range pairs {
		m[p] = fmt.Sprintf(format, symbols[i])
	}
	return m
}

// newClient returns the sources' client over base. It follows no redirect, so
// a source can't send the TEE to another host, or off TLS.
func newClient(base http.RoundTripper) *http.Client {
	return &http.Client{
		Transport:     base,
		CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse },
	}
}

// fetch returns src's price for pair, in decimals.
func fetch(ctx context.Context, client *http.Client, src source, pair string) (*big.Int, error) {
	ctx, cancel := context.WithTimeout(ctx, sourceTimeout)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, src.urls[pair], nil)
	if err != nil {
		return nil, err
	}
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close() //nolint:errcheck // the body is read in full or dropped; nothing to report
	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("status %d", res.StatusCode)
	}
	body, err := io.ReadAll(io.LimitReader(res.Body, maxBody+1))
	if err != nil {
		return nil, err
	}
	if len(body) > maxBody {
		return nil, errors.New("answer over the limit")
	}
	s, err := src.price(body)
	if err != nil {
		return nil, err
	}
	return parsePrice(s)
}

var decimalRE = regexp.MustCompile(`^[0-9]{1,20}(\.[0-9]{1,30})?$`)

// parsePrice reads a positive decimal string, as the sources write prices, in
// decimals; digits past them are dropped.
func parsePrice(s string) (*big.Int, error) {
	if !decimalRE.MatchString(s) {
		return nil, fmt.Errorf("price %q is not a decimal", s)
	}
	whole, frac, _ := strings.Cut(s, ".")
	frac = (frac + strings.Repeat("0", decimals))[:decimals]
	n, ok := new(big.Int).SetString(whole+frac, 10)
	if !ok || n.Sign() <= 0 {
		return nil, fmt.Errorf("price %q is not positive", s)
	}
	return n, nil
}

// Each reader decodes leniently: the APIs add fields over time.

func coinbasePrice(body []byte) (string, error) {
	var v struct {
		Data struct {
			Amount string `json:"amount"`
		} `json:"data"`
	}
	err := json.Unmarshal(body, &v)
	return v.Data.Amount, err
}

func krakenPrice(body []byte) (string, error) {
	var v struct {
		Error  []string `json:"error"`
		Result map[string]struct {
			Last []string `json:"c"` // the last trade: price, volume
		} `json:"result"`
	}
	if err := json.Unmarshal(body, &v); err != nil {
		return "", err
	}
	if len(v.Error) > 0 || len(v.Result) != 1 {
		return "", errors.New("not one ticker")
	}
	for _, t := range v.Result {
		if len(t.Last) > 0 {
			return t.Last[0], nil
		}
	}
	return "", errors.New("no last trade")
}

func bitstampPrice(body []byte) (string, error) {
	var v struct {
		Last string `json:"last"`
	}
	err := json.Unmarshal(body, &v)
	return v.Last, err
}
