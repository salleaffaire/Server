
function _log(text) {
  console.log(text);
}

// A message object
// -------------------------
function message(_text, _from) {
  this.text = _text;
  this.from = _from;
}

function messages() {
  this.list = {};
  this.sequence = {};
  this.last_read = {};

  this.add = function(text, from, to) {
    if (!(to in this.list)) {
      this.list[to] = [];
      this.sequence[to] = 0;
      this.last_read[to] = 0;
    }

    this.list[to].push(new message(text, from));
    this.sequence[to] += 1;
  }

  this.read = function(to) {
    var temp_list = [];

    if (to in this.list) {
      var index = this.last_read[to];
      while (index < this.sequence[to]) {
        temp_list.push(this.list[to][index]); 
        index += 1;
      }
      this.last_read[to] = index;
    }

    return temp_list;
  }

};


var message_queues = new messages();

message_queues.add("Hello", "Me", "You");
message_queues.add("Hello Again", "Paul", "You");
message_queues.add("Hello Again Again", "Me", "Paul");


console.log(message_queues.list["You"]);

console.log(message_queues.read("Paul"));
console.log(message_queues.read("Paul"));


