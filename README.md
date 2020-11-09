# remothon-control

## configuration

create a `config.json` file inside the directory with the following parameters:

```js
{
	"token": "", // discord bot token
	"mongoUri": "", // mongodb connection uri
	"eventStart": 0, // epoch timestamp of the event starting point (in miliseconds)
	"guild": "", // guild snowflake id
	"debug": true // set to true to print the errors on the console, set to false to print them to logs/errors.log
}
```
