package main

import (
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/keystore"
)

func CreateAccount() {
	ks := keystore.NewKeyStore(".", keystore.StandardScryptN, keystore.StandardScryptP)
	account, err := ks.NewAccount("Creation password")
	if err != nil {
		panic(err)
	}
	fmt.Println("Account: ", account.Address.Hex())
}
