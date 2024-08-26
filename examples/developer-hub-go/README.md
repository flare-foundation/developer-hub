# developer-hub-go

## Tooling

- [Go](https://go.dev/doc/install)
- [golangci-lint](https://golangci-lint.run/welcome/install/)

## Install dependencies

```bash
go get -u
```

## Generate Go bindings

```bash
go generate
```

## Run main.go

```bash
go run .
```

## Format

```bash
go fmt ./...
```

## Lint

```bash
golangci-lint run
```

## Test

```bash
go test ./coston2 -v
go test ./flare -v
```
