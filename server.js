var net = require("net");
const port = 8080;
const host = "127.0.0.1";

const MAX = 2 ** 32 - 1;
const ERROR_INCORRECT_SYNTAX = "error: incorrect syntax";
const ERROR_INVALID_INPUT = "error: invalid input";
const ERROR_DIVISION_BY_ZERO = "error: division by zero";
const OPERATORS = ["+", "-", "*", "/", "%"];

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

  function onConnData(data) {
    // console.log('Connection data from %s: %j', remoteAddress, data);
    let results = [];
    const inputs = data.split("\n");
    if (inputs.length <= 0) {
      results.push[ERROR_INVALID_INPUT];
      conn.write(results);
      return;
    }
    inputs.forEach(input => {
      const command = input.trim();
      let operatorIndex = -1;
      for (let operator of OPERATORS) {
        operatorIndex = command.indexOf(operator);
        if (operatorIndex !== -1) {
          break;
        }
      }
      if (operatorIndex === -1) {
        results.push(ERROR_INCORRECT_SYNTAX);
        return;
      }
      const operator = command[operatorIndex];
      const leftOperand = command.substring(0, operatorIndex);
      const rightOperand = command.substring(operatorIndex + 1, command.length);
      if (leftOperand.indexOf(" ") !== -1 || rightOperand.indexOf(" ") !== -1) {
        results.push(ERROR_INCORRECT_SYNTAX);
        return;
      }

      const leftNum = Number(leftOperand);
      const rightNum = Number(rightOperand);

      if (isNaN(leftNum) || isNaN(rightNum)) {
        results.push(ERROR_INCORRECT_SYNTAX);
        return;
      }

      if (!isValidU32Integer(leftNum) || !isValidU32Integer(rightNum)) {
        results.push(ERROR_INCORRECT_SYNTAX);
        return;
      }

      if ((operator === "/" || operator === "%") && rightNum === 0) {
        results.push(ERROR_DIVISION_BY_ZERO);
        return;
      }
      results.push(calculation(leftNum, rightNum, operator));
    });
    conn.write(results.join("\n"));
  }

  function onConnClose() {
    console.log("connection from %s closed", remoteAddress);
  }

  function onConnError(err) {
    console.log("Connection %s error: %s", remoteAddress, err.message);
  }
}

function isValidU32Integer(number) {
  if (number < 0 || number > MAX) {
    return false;
  }
  if (!Number.isInteger(number)) {
    return false;
  }
  return true;
}

function calculation(left, right, operator) {
  let result;
  switch (operator) {
    case "+":
      result = left + right;
      break;
    case "-":
      result = left - right;
      break;
    case "*":
      result = left * right;
      break;
    case "/":
      result = left / right;
      break;
    case "%":
      result = left % right;
      break;
    default:
      break;
  }
  if (result > MAX) result = 0;
  if (result < 0) result = MAX;
  return Math.floor(result);
}
