// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
var fs = require('fs');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
//backdate a jwt 30 seconds
var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');

// sign with RSA SHA256
var cert = fs.readFileSync('../private_key.txt');  // get private key
var certPub = fs.readFileSync('../public_key.txt');  // get private key

var priv = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCz3NUUGabt1AiFgpfKNZidIsP3VSfuz2l1T35tA2WjL9Syn+K+/KlTgnrYV1ULC8UQ1+SvRk26Fi2oljY67tOF80B3lHH0/JfHk/s1cC5ajM2SVNXyd0WGumP9Tba22FtPNmlHx3WLIErz7q5o5h3MdtjdXJ9u50Yy/k6yIESk+kiPUko6nXMmNftg1kUwW3ZRVVV5fu3lhBPglF4CVaGndMWrUnczkxctVk4hyXThVzSFSq+Zg6Wl+D5TVxbqQZTYjAYgD2LIv52mu8mmmsEelCCtBpzNGPCuYG3+YPi8AeAzUFxhG1b5PFbgGrG/j1Gl04akjfvWk1trzoDVr2DbAgMBAAECggEALbQGnOXryfEf/TTy9xnpXrxvyVBlJkSkCoAZov/C+tVzmbQQ/PDc4fB84K5IWNczyxTg8jzOEWQDVBxfSVhYfWgTUI9y6Yqp0rfilHCeBrpSnkVaXBM8ooCIWdw+enW9tgIgfHHNh328LgHPZa5bkhH9Bzq69IZmCx0dyBt09eqJw6cVYXfeGPC1YI695eN4EYfABJpMyM6WbqfZBOE7Xay6l8ZDR0r8xGsK5F1+hSeYI4lyp1fWFBNpx7pZvUPhvcqmxDs10pX8VCTpEjZMhnFs40krl2DOsfvCqiuRz7pBC38ohrw7JVQE8uUb97P3cQsRIJe3uOYJBGcxbEPgiQKBgQDpyMIAHv0dVW5jJh1jDgOTi1eHxJlA/BIajw8hDuqB3VhvwG7Jp9I1VmKr1Ol2ZjtE7jqmfh+UD9tb/VSqkfoiwPGISOqfu2LcDfOn5XbZM9TEDLBj0XJ3aUoEhHmDE+CyZSsqZE57/oTxwXwrVoeuuimz1VjtiBm7b6h56KGHvQKBgQDE9FSJIIqukIZwz1e8oXQoHoZpVV3t68awS3mHd0/B1WSJYJWRotbJh4JNaBAsb1zZkxJ2JenheLKN1KGxDQk3nq0xAopzbNwijMG32cbf/RponxNKypsFHiBZHuzqypv+gfCunWbMabQ9Rm7y7apqKi0KmhEIdJpW0eqxBE7odwKBgGtjJHoZwfrvez1gDK+riEkGALcEv8DyCP7aKADvcRkmK7Fpm3pV9GE7xSdZLcSNQTxwkdBYrvi8L+8ZdwLC+ztrlYcct2mYEdkzL3E4Hle3T0ye54dydjoTy0Q39fkX8GcBwco/OS4Lw9WpIvhlTv4b1XwdzDOQCQHoUGNvUIOhAoGBALO2nkxhvSl8BrB5AX3FdNAGym7izkqCkVHcDJBndgdQR+RylQfGpmZNl8A57EgfdYGyiW31OmvaTlLMap27X2W5DB9kSiD4fAWqmjjAJo/Ly4UbYeck6D7LNokbhuLW7XBV8N/kECEFcslWs3ZHFvC4e1DpNBGbFBmUgan0XGwRAoGBAJETOtj9KSsonr5mHNnAwKzfxOTh28SKz2j1IGWPgv73GvaZgtyT5emn1vk72cIicEZlfiS1tzlr4NjliC4c4LIvbGrDGK2dcJpr94+FHL3gtToGlYTrksCgdbikAbxzICPYkV3nIHaKqNRiOnF7j7795mnxSHUd+2WOJBvXLAml\n-----END PRIVATE KEY-----'
var pub = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs9zVFBmm7dQIhYKXyjWYnSLD91Un7s9pdU9+bQNloy/Usp/ivvypU4J62FdVCwvFENfkr0ZNuhYtqJY2Ou7ThfNAd5Rx9PyXx5P7NXAuWozNklTV8ndFhrpj/U22tthbTzZpR8d1iyBK8+6uaOYdzHbY3VyfbudGMv5OsiBEpPpIj1JKOp1zJjX7YNZFMFt2UVVVeX7t5YQT4JReAlWhp3TFq1J3M5MXLVZOIcl04Vc0hUqvmYOlpfg+U1cW6kGU2IwGIA9iyL+dprvJpprBHpQgrQaczRjwrmBt/mD4vAHgM1BcYRtW+TxW4Bqxv49RpdOGpI371pNba86A1a9g2wIDAQAB\n-----END PUBLIC KEY-----'


var token = jwt.sign({ foo: 'bar' }, priv, { algorithm: 'RS256'});

// sign asynchronously
jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256' }, function(err, token) {
  console.log(token);
});

jwt.verify(token, pub, function(err, decoded) {
	if(err) console.log(err)
  console.log(decoded) // bar
});