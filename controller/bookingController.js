const Booking = require("../model/bookingModel")
const Customers = require("../model/custModel")


const newBooking = (async (req , res) => {
    const { Customers , Movies , status , seats , amount , paid , unpaid} = req.body

    const data = await Booking.create({
        Customers , 
        Movies,
        seats,
        status,
        amount,
        paid,
        unpaid
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
        const data = await Booking.aggregate([
        {
            $lookup:{
                from: "customers",           //collection name which is to be joined
                localField: "Customers" ,   //from booking schema 
                foreignField: "_id",       //field from customer collection
                as: "customerDetail"
            }
        },
        {
            $unwind:{
                path: "$customerDetail"
            }
        },
            {
                $group: {
                    _id: {
                        customer_id: "$Customers",
                        status: "$status",
                    
                    },
                    total: 
                    { $sum: "$amount"},
                    detail: {$push: '$$ROOT'}
                    
                }
            },
            // {
            //     $project: {
            //         customer_id: "$_id.Customers",
            //         status: "$_id.status",
            //         total: 1,
    
            //     },
            // },
            
        ])
        
        res.status(200).json(data)
        
    } catch (error) {
        res.status(500).json(error)
    }
})



const totalAmount = (async ( req , res) => {
    try {
        const data = await Booking.aggregate([
           
            {
                $lookup: {
                    from: "customers",
                    localField:"Customers",
                    foreignField:"_id",
                    as:"details"
                }
            },

            { $unwind: "$details"},

            // {
            //     $project: {
            //         customer_id: "$_id.customer_id",
            //         status: "$_id.status",
            //         amount: 1,
            //         total: 1,
            //     }
            // },
           
            //
            {
                $group: {
                    _id: {
                    customer_id: "$customer_id",
                    status: "$status",
                    amount: "$amount",
                 },
                    total: 
                    { $sum: "$amount"}

                }
            },
    {
        $addFields: {
            paidAmount : "$paid.total",
            unpaidAmount : "$unpaid.total"
        }
    },
    //         {
    //             $project: {
    //                 // _id: 0,
                    
    //                 customer_id: "$_id.customer_id",
    //                 status: "$_id.status",
    //                 total: 1,
    //             },
{
                Paid: { 
                    $push: {
                    $cond: [
                        {
                            $eq : [ "$status" , "paid"] 
                        },
                            { paid: "$total"},
                        
                    ]
                }   
                },
                Unpaid: {
                    $push: {
                    $cond: [
                        {
                            $eq: ["$status" , "unpaid"]
                        },
                            { unpaid: "$total"}
                    ]
                } }               
            },
            
            {
                $project: {
                    customer_id: "$_id.customer_id",
                    status: "$_id.status",
                    total: 1,
                    Paid: "$Paid.paid",
                    Unpaid: "$Unpaid.unpaid"
                }
            }
        ])
        res.status(200).json(data)
        console.log(data)
        
    } catch (error) {
        res.status(500).json(error)
    }

})



module.exports = { newBooking , status , totalAmount}