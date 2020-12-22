import web3 from './web3';


const address = process.env.ADDRESS;

const abi = process.env.ABI;

export default new web3.eth.Contract(abi, address);