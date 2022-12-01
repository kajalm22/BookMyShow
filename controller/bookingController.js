const Booking = require("../model/bookingModel")
const Customers = require("../model/custModel")


const newBooking = (async (req , res) => {
    const { Customers , Movies , status , seats , amount } = req.body

    const data = await Booking.create({
        Customers , 
        Movies,
        seats,
        status,
        amount,
        
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
        // {
        //     $lookup: {
        //         from: "payments",
        //         localField: "Payments",
        //         foreignField: "_id",
        //         as: "paymentStatus"

        //     }
        // },
        { $unwind: "$customerDetail"},
        // { $unwind: "paymentStatus"},

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

            
            {
                $project: {
                    _id: 0,
                    customer_id: "$_id.customer_id",
                    status: "$_id.status",
                    total: 1,
                    
    
                },
            },
    
        ])
        
        res.status(200).json(data)
        
    } catch (error) {
        res.status(500).json(error)
    }
})


//result
// [
//     {
//         cust_id,
//         paid: 100
//         unpaid: 200
//         total:300    
//     }
// ]


const totalAmount = (async ( req , res) => {
            try {
                const result = await Booking.aggregate([

                    {
                        $lookup:{
                            from: "customers",           
                            localField: "Customers" ,   
                            foreignField: "_id",       
                            as: "bookingDetail"
                        }
                    },
                    
                    {
                        $unwind:{
                            path: "$bookingDetail"
                        }
                    },
                    {
                        $group: {
                            _id: {
                                customer_id: "$Customers",
                                status: "$status",
                            },
                            total: { $sum: "$amount" },
                            detail: {$push: '$$ROOT'}
                        },
                    }, 
                    {
                            P_Paid: {
                                $push: {
                                    $cond: [
                                        { $eq: ["$status", "paid"] },
                                        { paid: "$total" },
                                        
                                    ],
                                },
                            },
                            U_Unpaid: {
                                $push: {
                                    $cond: [
                                        { $eq: ["$status", "unpaid"] },
                                        { unpaid: "$total" },
                                
                                    ],
                                },
                            },
                        
                        },
                   
                    {
                        $project:{
                        customer_id:"$_id.customer_id",
                        Unpaid: { $ifNull: ["$U_Unpaid" , "no value"] },
                        Paid: { $ifNull: ["$P_Paid" , "no value"] }, 
                        Total: { $sum: ["$P_Paid", "$U_Unpaid"] },
                        _id: 0,
                       }
                    }
                    
                ]);
        res.status(200).json(result)
        // console.log(data)
        
    } catch (error) {
        res.status(500).json(error)
    }

})



const updateBooking = (async (req, res) => {

    const updated = await Booking.findByIdAndUpdate( 
     req.params.id,
      req.body
    );
    if (updated) {
      res.status(200).json(updated);
    } else {
      res.status(400);
  
      throw new Error("Booking details could not be updated!");
    }
  });


const deleteBooking = ( async ( req , res) => {
    try {
        const booking = await Booking.deleteOne({ _id: req.params.id})
        res.status(200).json(booking )
        
    } catch (error) {
        res.status(500).json("Booking could not be deleted")
    }
})

module.exports = { newBooking , status , totalAmount , deleteBooking , updateBooking }