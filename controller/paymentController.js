const { default: Ajv } = require("ajv")
const AJV = require("ajv")
const ajv = new Ajv()
const  Payment = require("../model/paymentModel")
const Customers = require("../model/custModel")


const newPayment = (async ( req , res) => {

    const schema = {
        type: "object",
        properties: {
        customer_id: {type: "string"} ,
        paymentType: {type: "string"}, 
        amount: {type: "number"} , 
        status: {type: "string"} ,
        total: {type: "number"}
    },
    required: ["customer_id" , "paymentType",  "amount" ,  "status" , "total"]
}

const validate = ajv.compile(schema);

  const valid = validate(req.body);

  if (!valid) {
    console.log(validate.errors);
    res.status(400).json({ err: validate.errors });
  }

    const { customer_id , paymentType,  amount ,  status , total } = req.body

    const data = await Payment.create({
        customer_id,
        paymentType,
        amount,
        status,
        total,
        // transaction_id
    })

    if(data){
    console.log(data)
    res.status(201).json(data , {message: "Payment details added!"})
    }else{

    res.status(500).json("Something went wrong")
    }
})


const status = (async ( req , res) => {
    try {
        const data = await Payment.aggregate([
            {
                $group: {
                    customer_id: "$customer_id",
                    status: "$status",
                    amount: "$amount",
                    total: 
                    { $sum: "$total"}
                    
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    customer_id: "$_id.customer_id",
                    status: "$_id.status"
    
                },
            },
            {
                $lookup:{
                    from: "Customers",
                    localField: ,
                    foreignField: 
                }
            }
        ])
        res.status(200).json(data)
        
    } catch (error) {
        res.status(500).json(err.message)
    }
})


module.exports = { status , newPayment}
