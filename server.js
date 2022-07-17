var net = require("net");
const port = 8080;
const host = "127.0.0.1";

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
  let buffer;

  function onConnData(data) {
    // console.log('Connection data from %s: %j', remoteAddress, data);
    console.log("con co be be", data);
    let results = [];
    const inputs = data.split("\n");
    if (inputs.length <= 0) {
      results.push["error: valid input"];
      conn.write(results);
      return;
    }
    inputs.forEach(input => {      
      const command = input.trim();
      console.log("con meo", command)
      console.log("get Buffer", Buffer.from(command, "utf-8"))
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
