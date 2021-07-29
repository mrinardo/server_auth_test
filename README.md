# Small HTTPS server sample with Node.js for testing Two-way SSL connections

This sample requires a server certificate, which can be self-signed.

Incoming connections will be accepted to the endpoint "/signin" if they send a client certificate issued by the server certificate's CA (aka yourself). Otherwise, the HTTP request will be closed with status 403.

## Generating a server certificate with OpenSSL

```shell
$ openssl req -x509 -newkey rsa:4096 -keyout server_key.pem -out server_cert.pem -days 365 -nodes -subj "/CN=localhost/O=Example Inc"
```

## Generating a valid client certificate with OpenSSL

Generate key and certificate request:
```shell
$ openssl req -newkey rsa:4096 -keyout client_key.pem -out client_csr.pem -nodes -subj "/CN=Valid Client"
```

Generate client certificate signed with the server certificate/key:
```shell
$ openssl x509 -req -in client_csr.pem -CA server_cert.pem -CAkey server_key.pem -out client_cert.pem -set_serial 01 -days 365
```

Convert the certificate to PCKS#12 (if you want to test with a browser, for example):
```shell
$ openssl pkcs12 -export -clcerts -in client_cert.pem -inkey client_key.pem -out client.p12
```

**Note:** copy the server certificate and key .pem files to the ./certs/ directory.

## Usage

```shell
$ npm install && npm start
```

The sample server will be accessable at http://localhost:3000/.

## Reference
- [Client Certificate Demo](https://github.com/sevcsik/client-certificate-demo/tree/chapter-1)