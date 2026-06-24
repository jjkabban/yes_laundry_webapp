import AfricasTalking from "africastalking";

const africasTalking = AfricasTalking({
  apiKey: String(process.env.AT_API_KEY),
  username: String(process.env.AT_USERNAME),
});

export default africasTalking;
