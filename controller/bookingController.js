const Booking = require("../model/bookingModel")
const Customers = require("../model/custModel")


const newBooking = (async (req , res) => {
    const { Customers , Movies , status , seats , amount } = req.body

    const data = await Booking.create({
        Customers , 
        Movies,
        // Payments,
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


// result
// [
//     {
//         cust_id,
//         paid: total paid by one cust,
//         satus:paid
//     },
//     {
//         cust_id,
//         unpaid: total unpaid by one cust,
//         status: unpaid
//     }
// ]
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
        
        { $unwind: "$customerDetail"},

            {
                $group: {
                    _id: {
                        
                        customer_id: "$Customers",
                        cust_first : "$customerDetail.firstName" , 
                        cust_last : "$customerDetail.lastName",
                        status: "$status",
                    
                    },
                    total: 
                    { $sum: "$amount"},
                    
                }
            },
         
            {
                $project: {
                    _id: 0,
                    customer_id: "$_id.customer_id",
                    fullName: { $concat: [ "$_id.cust_first" , " " , "$_id.cust_last"]},
                    // customer_name: "$_id.cust_name", 
                    status: "$_id.status",
                    total: 1
                   
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

                    // {
                    //     $lookup:{
                    //         from: "customers",           
                    //         localField: "Customers" ,   
                    //         foreignField: "_id",       
                    //         as: "customerDetails"
                    //     }
                    // },
                    // {
                    //     $lookup: {
                    //         from: "payments",
                    //         localField: "Payments",
                    //         foreignField: "_id",
                    //         as: "paymentDetails"
                    //     }
                    // },
                    // {
                    //     $unwind: "$paymentDetails"
                    // },
                    
                    // {
                    //     $unwind: "$customerDetails"
                    
                    // },
                   
                    {
                        $project: {
                            
                            "Customer_ID" : "$Customers",
                            "Amount": "$amount",
                            "Status" : "$status",
                            "_id": 0
                        }
                    },
                    
                    {
                        $group: {
                            _id: {
                                Customer_ID : "$Customer_ID",
                                Status: "$Status",
                            },
                            Amount: { $sum: "$Amount" }
                        },
                    }, 
                    
                    {
                        $project: {
                          
                          Customer_ID: "$_id.Customer_ID",
                          
                          Status: "$_id.Status",
                          Amount: 1,
                          _id: 0,
                        }
                      },
                      {
                        $group: {
                            _id:
                        {
                            Customer_ID: "$Customer_ID"
                        },
                      
                            P_Paid: {
                                $push: {
                                    $cond: [
                                        { $eq: ["$Status", "paid"] },
                                        { Paid: "$Amount" },
                                        "$$REMOVE" 
                                               
                                    ],
                                },
                            },
                            U_Unpaid: {
                                $push: {
                                    $cond: [
                                        { $eq: ["$Status", "unpaid"] },
                                        { Unpaid: "$Amount" }, 
                                        "$$REMOVE"
            
                                    ],
                                },
                            }   
                         },
                      },
                        {
                            $project: {
                                _id: 1,
                                isAnyTrueP : { $anyElementTrue: ["$P_Paid"] },
                
                                isAnyTrueU : { $anyElementTrue: ["$U_Unpaid"] },
                                
                                Customer_ID: "$_id.Customer_ID",
                                Paid: { $arrayElemAt: ["$P_Paid", 0] },
                                Unpaid: { $arrayElemAt: ["$U_Unpaid", 0] },
                            }
                        },
                        {
                            $project: {
                                Customer_ID: 1,
                                _id:0,
                                Paid: {
                                    $cond: [{ $eq: ["$isAnyTrueP", false] }, 0, "$Paid.Paid" ],
                                  },
                
                                Unpaid: {
                                    $cond: [{ $eq: ["$isAnyTrueU", false] }, 0, "$Unpaid.Unpaid" ],
                                  },
                
                            }
                        },
                        {
                            $project: {
                            //   _id:0,
                              Customer_ID: 1,
                              Paid: 1,
                              Unpaid: 1,
                              Total: { $sum: ["$Paid", "$Unpaid"] },
                              Status: { $cond: [{ $eq: ["$Unpaid", 0] }, "paid", "unpaid"] },
                            },
                        }
                    
                    // // {
                    // //     $project:{
                    // //     customer_id:"$_id.customer_id",
                    // //     Unpaid: { $ifNull: ["$Amount_Unpaid" , "null"] },
                    // //     Paid: { $ifNull: ["$Amount_Paid" , "null"] }, 
                    // //     Total: { $sum: ["$Amount_Paid", "$Amount_Unpaid" ] },
                    // //     _id: 0,
                    // //    }
                    // // },
       
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
    status , 
    totalAmount , deleteBooking , updateBooking }