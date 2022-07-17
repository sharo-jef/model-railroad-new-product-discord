# model-railroad-new-product-discord

## Ubuntu で動作しない場合

```
error while loading shared libraries: libgbm.so.1: cannot open shared object file: No such file or directory
```

なエラーが出ている場合は

```
sudo apt install -y libgbm1
```

を実行する。

詳細: https://github.com/puppeteer/puppeteer/issues/290
