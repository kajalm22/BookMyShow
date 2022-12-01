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


// const status = (async ( req , res) => {
//     try {
//         const data = await Booking.aggregate([
//         {
//             $lookup:{
//                 from: "customers",           //collection name which is to be joined
//                 localField: "Customers" ,   //from booking schema 
//                 foreignField: "_id",       //field from customer collection
//                 as: "customerDetail"
//             }
//         },
//         // {
//         //     $lookup: {
//         //         from: "payments",
//         //         localField: "Payments",
//         //         foreignField: "_id",
//         //         as: "paymentStatus"

//         //     }
//         // },
//         { $unwind: "$customerDetail"},
//         // { $unwind: "paymentStatus"},

//             {
//                 $group: {
//                     _id: {
//                         customer_id: "$Customers",
//                         status: "$status",
                    
//                     },
//                     total: 
//                     { $sum: "$amount"},
//                     detail: {$push: '$$ROOT'}
                    
//                 }
//             },

            
//             {
//                 $project: {
//                     _id: 0,
//                     customer_id: "$_id.customer_id",
//                     status: "$_id.status",
//                     total: 1,
                    
    
//                 },
//             },
    
//         ])
        
//         res.status(200).json(data)
        
//     } catch (error) {
//         res.status(500).json(error)
//     }
// })


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
                            as: "bookingDetails"
                        }
                    },
                    {
                        $lookup: {
                            from: "payments",
                            localField: "Payments",
                            foreignField: "_id",
                            as: "paymentDetails"
                        }
                    },
                    
                    {
                        $unwind: "$bookingDetails"
                    
                    },
                    {
                        $unwind: "$paymentDetails"
                    },
                    // {
                    // detail: {$push: '$$ROOT'}
                    // },
                   
                    {
                        $project: {
                            
                            "paymentDetails.customer_id" : 1,
                            "paymentDetails.total": 1,
                            "paymentDetails.status" : 1,
                            _id:0,
                        }
                    },
                    {
                        $addFields: {
                            Customer_id: "$paymentDetails.Customers",
                            Amount: "$paymentDetails.total",
                            Status: "paymentDetails.status",

                        }
                    },
                    // { $project: 
                    //     { 
                    //         paymentDetails: 0, bookingDetails: 0
                    //      }
                    //      },
                    
                    {
                        $group: {
                            _id: {
                                Customer_id: "$Customers",
                                Status: "$Status",
                            },
                            Amount: { $sum: "$Amount" },
                            
                        },
                    }, 
                    {
                        $project: {
                          
                          Customer_id: "$_id.Customer_id",
                          Status: "$_id.Status",
                          Amount: 1,
                          _id: 0,
                        },
                      },
                    {
                            P_Paid: {
                                $push: {
                                    $cond: [
                                        { $eq: ["$Status", "Paid"] },
                                        { Paid: "$Amount" },
                                        
                                    ],
                                },
                            },
                            U_Unpaid: {
                                $push: {
                                    $cond: [
                                        { $eq: ["$Status", "Unpaid"] },
                                        { Unpaid: "$Amount" },
            
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                isAnyTrue : { $anyElementTrue: ["$P_Paid"] },
                
                                isAnyTrue : { $anyElementTrue: ["$U_Unpaid"] },
                                _id: 1,
                                Customer_id: "$_id.Customer_id",
                                Paid: { $arrayElemAt: ["$P_Paid.Paid", 0] },
                                Unpaid: { $arrayElemAt: ["$U_Unpaid.Unpaid", 0] },
                            }
                        },
                        {
                            $project: {
                                Customer_id: 1,
                                Paid: 1,
                                Unpaid: 1,
                
                                Paid: {
                                    $cond: [{ $eq: ["$isAnyTrue", false] }, 0, { Paid: "$Paid" }],
                                  },
                
                                Unpaid: {
                                    $cond: [{ $eq: ["$isAnyTrue", false] }, 0, { Unpaid: "$Unpaid" }],
                                  },
                
                            }
                        },
                        { 
                            $project: {
                                Customer_id: 1,
                                Paid: {
                                    $cond: [
                                        {
                                            $eq: ["$Paid" , 0] } , 0 , "$Paid.Paid" ]},
                                Unpaid:  {
                                    $cond: [
                                        {
                                            $eq: ["$Unpaid" , 0]
                                        } , 0 , "$Unpaid.Unpaid"
                                    ]
                                }  ,
                                _id: 0             
                                
                            }
                        },
                        {
                            $project: {
                              Customer_id: 1,
                              Paid: 1,
                              Unpaid: 1,
                              Total: { $sum: ["$Paid", "$Unpaid"] },
                              Status: { $cond: [{ $eq: ["$Unpaid", 0] }, "Paid", "Unpaid"] },
                            },
                          }
                    
                    // {
                    //     $project:{
                    //     customer_id:"$_id.customer_id",
                    //     Unpaid: { $ifNull: ["$Amount_Unpaid" , "null"] },
                    //     Paid: { $ifNull: ["$Amount_Paid" , "null"] }, 
                    //     Total: { $sum: ["$Amount_Paid", "$Amount_Unpaid" ] },
                    //     _id: 0,
                    //    }
                    // },
       
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

module.exports = { newBooking , 
    // status , 
    totalAmount , deleteBooking , updateBooking }