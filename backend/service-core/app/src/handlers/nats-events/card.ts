import { APP_ID, NATS_TOPIC_GET_CARD } from "../../config/config"
import { jsonCodec, request } from "../../services/nats.service"

type TransactionInfo = {
  cardUid: string;
  amount: number;
};

// export const dropBalance = async (state: TransactionInfo) => {
//   const res = await request(
//     NATS_TOPIC_DROP_BALANCE,
//     jsonCodec.encode({
//       cardUid: state.cardUid,
//       action: 'USER_DROPPED',
//       tags: ['QPARKING'],
//       information: {
//         project: 'QPARKING',
//       },
//       description: 'Stayed on parking',
//       amount: state.amount,
//       appId: APP_ID
//     }),
//     {
//       timeout: 5000
//     })

//   return res
// }

export const getCard = async (cardUid: string) => {
  const res = await request(
    NATS_TOPIC_GET_CARD,
    jsonCodec.encode({
      cardUid
    }),
    {
      timeout: 5000
    })
  
  if (res)
    return (jsonCodec.decode(res.data) as any).result
}