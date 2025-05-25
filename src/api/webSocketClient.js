// import SockJS from 'sockjs-client'
// import Stomp from 'stompjs'

// let stompClient = null;

// function connect(onNieuwProduct, onProductVerwijderd) {
//   const socket = new SockJS('http://localhost:8080/ws');
//   stompClient = Stomp.over(socket);

//   stompClient.connect({}, () => {
//     // ✅ Realtime toegevoegd of bewerkt
//     stompClient.subscribe('/topic/products', message => {
//       const product = JSON.parse(message.body);
//       onNieuwProduct(product);
//     });

//     // ✅ Realtime verwijderd
//     stompClient.subscribe('/topic/producten-verwijderd', message => {
//       const verwijderdId = JSON.parse(message.body);
//       onProductVerwijderd(verwijderdId);
//     });
//   });
// }

// function verwijderViaSocket(id) {
//   if (stompClient) {
//     stompClient.send("/app/product/delete", {}, id.toString());
//   }
// }

// export default {
//   connect,
//   verwijderViaSocket
// };

import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

let stompClient = null;

function connect(onNieuwProduct, onProductVerwijderd) {
  const socket = new SockJS('http://localhost:8080/ws'); // zelfde als in WebSocketConfig
  stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    console.log("✅ WebSocket verbonden");

    // 📦 Luister naar nieuwe of bijgewerkte producten
    stompClient.subscribe('/topic/producten', message => {
      const product = JSON.parse(message.body);
      onNieuwProduct(product); // callback uit ProductOverzicht.vue
    });

    // 🗑️ Luister naar verwijderde producten
    stompClient.subscribe('/topic/verwijderd', message => {
      const verwijderdId = JSON.parse(message.body);
      onProductVerwijderd(verwijderdId); // callback uit ProductOverzicht.vue
    });
  });
}

// 🔴 Alleen nodig als je producten ook via socket wilt verwijderen
function verwijderViaSocket(id) {
  if (stompClient && stompClient.connected) {
    stompClient.send("/app/product/delete", {}, id.toString());
  }
}

export default {
  connect,
  verwijderViaSocket // optioneel, alleen als je dit gebruikt
};
