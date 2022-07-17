var net = require("net");
const port = 8080;
const host = "127.0.0.1";

const ERROR_INCORRECT_SYNTAX = 'error: incorrect syntax';
const ERROR_INVALID_INPUT = 'error: invalid input';
const ERROR_DIVISION_BY_ZERO = 'error: division by zero';

var server = net.createServer();
server.on("connection", handleConnection);

server.listen(port, host, function() {
  console.log("TCP Server is running on port " + port + ".");
});

function handleConnection(conn) {
  var remoteAddress = conn.remoteAddress + ":" + conn.remotePort;
  console.log("New client connection from %s", remoteAddress);
  conn.setEncoding("utf8");

  conn.on("data", onConnData);
  conn.once("close", onConnClose);
  conn.on("error", onConnError);
  
  const operators =  ["+", "-", "*", "/", "%"];

  function onConnData(data) {
    // console.log('Connection data from %s: %j', remoteAddress, data);
    console.log("con co be be", data);
    let results = [];
    const inputs = data.split("\n");
    if (inputs.length <= 0) {
      results.push[ERROR_INVALID_INPUT];
      conn.write(results);
      return;
    }
    inputs.forEach(input => {      
      const command = input.trim();
      console.log("con meo", command);
      let operatorIndex = -1;
      for (let operator of operators) {
        operatorIndex = command.indexOf(operator);
        if (operatorIndex !== -1) {
          break
        };
      }
      if (operatorIndex === -1) {
        results.push(ERROR_INCORRECT_SYNTAX);
        return;
      }
      const operator = command[operatorIndex]
      const leftOperand = Number(command.substring(0,operatorIndex).trim())
      const rightOperand = Number(command.substring(operatorIndex+1,command.length).trim())
      if (isNaN(leftOperand)|| isNaN(rightOperand)) {
        results.push(ERROR_INCORRECT_SYNTAX);
        return;
      }

      if (operator === "/" && rightOperand === '0') {
        results.push(ERROR_DIVISION_BY_ZERO);
        return;
      }

      console.log('con co be be', Number(leftOperand), Number(rightOperand));
      results.push(command)
    });
    console.log("con heo", results)
    conn.write(results.join("\n"));
  }

  function onConnClose() {
    console.log("connection from %s closed", remoteAddress);
  }

  function onConnError(err) {
    console.log("Connection %s error: %s", remoteAddress, err.message);
  }
}
