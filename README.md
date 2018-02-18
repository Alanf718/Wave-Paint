# webpack

### Changing ports

In package.json you will see the following npm scripts
```
"start:dev": "webpack-dev-server --progress --colors --inline --hot --port 3001",
"open:dev": "node node_modules/opn-cli/cli http://localhost:3001/ || true",
```

replace the --port 3001 parameter in start:dev, as well as http://localhost:3001 in open:dev with the port you want to change it to


### Dev server proxy
You wil find the two place holder proxies to your backend at
```
    config.devServer = {
        port: hotMiddleWarePort,
        ...
        proxy: [
            {
                path: '/assets/common-styles.css',
                target: `http://localhost:3001`,
                ...

```
Add or modify the current proxies to reflect the routes and port your dev servers are running on.