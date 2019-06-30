//this server accepts connections from the employees in order to store usage data and allow the other server to access.

const Net = require('net');
//server test
const employeesConnected=[];
const Team = require('./models/Team');


const port = 7250;
module.exports = class EmployeeServer {
  constructor(mongoose) {
    this.server = Net.createServer();
    this.connectionCount = 0;
    this.server.listen(port, () => {
      console.log("Server Listening on port: " + port);
    });
    this.server.on('connection', socket => {
      console.log('A new connection has been established.');

      // Now that a TCP connection has been established, the server can send data to
      // the client by writing to its socket.
      this.connectionCount++;

      // The server can also receive data from the client by reading from its socket.
      socket.on('data', function (chunk) {
        let data = chunk.toString();
        console.log(`Data received from client: ${data}`);
        switch (data.includes(":") ? data.split(':')[0] : data) {
          case "ID":
            let id = data.split(':')[1];
            socket.employeeId = id;
            Team.findOneAndUpdate({'employees._id': id}, {$set: {'employees.$.lastLogin': Date.now()}}, {}, (err, doc) => {

              if (!doc) {
                socket.write("INIT");//TODO parse team names
              }


            });
            break;
          case "REGISTER":
            let teamName = data.split(':')[1];
            let id2 = data.split(':')[2];//TODO use the one stored in socket.

            Team.findOneAndUpdate({_id: teamName}, {
              $push: {
                employees: {
                  _id: id2,
                  lastLogin: Date.now()
                }
              }
            }, {/*upsert: true*/}, (err, doc) => {
              if (!doc) {
                socket.write("INIT");//TODO parse team names
              }
            });


        }
      });

      // When the client requests to end the TCP connection with the server, the server
      // ends the connection.

      socket.on('end', () => {
        console.log('Closing connection with the client');
        this.connectionCount--;
      });

      // Don't forget to catch error, for your own sake.

      socket.on('error', err => {
        console.log(`Error: ${err}`);
        this.connectionCount--;
      });
    });
  }

};


