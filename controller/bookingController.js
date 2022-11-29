const Booking = require("../model/bookingModel")
const Customers = require("../model/custModel")


const newBooking = (async (req , res) => {
    const { Customers , Movies , status , seats , amount} = req.body

    const data = await Booking.create({
        Customers , 
        Movies,
        seats,
        status,
        amount
    })

    if(data){
        console.log(data)
        res.status(201).json( {message: "Booking details added!"})
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
                    //  _id: 0,
                    total: 1,
                    customer_id: "$_id.customer_id",
                    status: "$_id.status"
    
                },
            },
            {
                $lookup:{
                    from: "Customers",
                    localField: "booking_id" ,
                    foreignField: "customer_id",
                    as: "BookingDetails"
                }
            }
        ])
        console.log(data)
        res.status(200).json(data)
        
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = { newBooking , status}