import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'

const socket = new SockJS('http://localhost:8080/ws') // backend WebSocket endpoint
const stompClient = Stomp.over(socket)

export default {
  connect(onMessageReceived) {
    stompClient.connect({}, () => {
      console.log('WebSocket verbonden')
      stompClient.subscribe('/topic/products', (message) => {
        const product = JSON.parse(message.body)
        onMessageReceived(product)
      })
    })
  },
  sendProduct(product) {
    stompClient.send('/app/product/add', {}, JSON.stringify(product))
  }
}
