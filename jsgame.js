module.exports = function(RED) {
  RED.settings.functionGlobalContext.canvas = globalThis.canvas;
  function JSGameInputNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    const handler = (data) => {
      if (data) {
        node.send({
          topic: 'JSGameInput',
          payload: data,
        });
      }
    };

    if (global.jsGameEmitter) {
      global.jsGameEmitter.on('update', handler);
    }

    node.on("close", () => {
      if (global.jsGameEmitter) {
        global.jsGameEmitter.removeListener('update', handler);
      }
    });
  }

  RED.nodes.registerType("jsgame-in", JSGameInputNode);

  function JSGameOut(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    if (globalThis.canvas) {
      node.status({ fill: "green", shape: "dot", text: `${globalThis.canvas.width} x ${globalThis.canvas.height}` });
    }
    node.on("input", (msg) => {
      node.log(`Received: ${msg.payload}`);
      if (globalThis.canvas) {
        node.status({ fill: "green", shape: "dot", text: `${globalThis.canvas.width} x ${globalThis.canvas.height}` });
      }
      if (global.jsGameEmitter) {
        global.jsGameEmitter.emit('msg', msg);
      }
    });
  }

  RED.nodes.registerType("jsgame-out", JSGameOut);
};

