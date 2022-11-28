
const  Payment = require("../model/paymentModel")


const newPayment = (async ( req , res) => {
try {
    const data = req.body

    const result = Payment.create(data)
    console.log(result)
    res.status(201).json(result)
} catch (error) {
    res.status(500).json(err.message)
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
                    total: { $sum: "$total"}
                    
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    status: 1
    
                },
            },
            {
                $lookup:{
                    from: "Customers",
                }
            }
        ])
        res.status(200).json(data)
        
    } catch (error) {
        res.status(500).json(err.message)
    }
})


module.exports = { status , newPayment}
