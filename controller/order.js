const db=require('../database/connection');
// API to insert data into Order_Header table-----------------------------------------------------------------------------
exports.orderheader=(req, res) => {
    const orderHeaderData = req.body;
    db.query('INSERT INTO order_header SET ?', orderHeaderData, (err, result) => {
      if (err) {
        console.error('Error inserting into Order_Header:', err);
        res.status(500).send('Internal Server Error');
      } else {
        
        res.status(201).json({
          message:'Order_Header data inserted successfully',
           orderId:orderHeaderData.order_id
        });
      }
    });
  };
  
  
  
  // API to insert data into Order_Item table----------------------------------------------------------------------------------
exports.orderItem= (req, res) => {
    const orderId = req.params.orderId;
    const orderItemsData = req.body;
  
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required in the URL parameters.' });
    }
  
    if (!orderItemsData || !Array.isArray(orderItemsData) || orderItemsData.length === 0) {
      return res.status(400).json({ error: 'Invalid or missing order_items data.' });
    }
  
    const insertQuery = 'INSERT INTO order_item SET ?';
  
    const errors = [];
  
    orderItemsData.forEach((orderItem) => {
      orderItem.order_id = orderId;
  
      db.query(insertQuery, orderItem, (err, result) => {
        if (err) {
          console.error('Error inserting into Order_Item:', err);
          if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            errors.push({ error: 'Invalid product_id. Product not found.', orderItem });
          } else {
            errors.push({ error: 'Internal Server Error', orderItem });
          }
        }
      });
    });
  
    if (errors.length > 0) {
      return res.status(500).json({ errors });
    }
  console.log("Order Item insert successfully");
    return res.status(201).json({ message: 'Order items inserted successfully' });
  };
  
  
  // API to get all orders---------------------------------------------------------------------------------------------------
  
  
exports.allorderget= (req, res) => {
    const selectQuery = `
      SELECT
        oh.order_id,
        oh.order_name,
        oh.placed_date,
        oh.approved_date,
        oh.status_id,
        oh.party_id,
        oh.currency_uom_id,
        oh.product_store_id,
        oh.sales_channel_enum_id,
        oh.grand_total,
        oh.completed_date,
        oi.order_item_seq_id,
        oi.product_id,
        oi.item_description,
        oi.quantity,
        oi.unit_amount,
        oi.item_type_enum_id
      FROM
        order_header oh
        LEFT JOIN order_item oi ON oh.order_id = oi.order_id
    `;
  
    db.query(selectQuery, (err, results) => {
      if (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const ordersMap = new Map();
  
      // Process the SQL results to format the response
      results.forEach((row) => {
        if (!ordersMap.has(row.order_id)) {
          // If order not in map, add it
          ordersMap.set(row.order_id, {
            order_id: row.order_id,
            order_name: row.order_name,
            placed_date: row.placed_date,
            approved_date: row.approved_date,
            status_id: row.status_id,
            party_id: row.party_id,
            currency_uom_id: row.currency_uom_id,
            product_store_id: row.product_store_id,
            sales_channel_enum_id: row.sales_channel_enum_id,
            grand_total: row.grand_total,
            completed_date: row.completed_date,
            order_items: [],
          });
        }
  
        // Add order item details to the order
        if (row.order_item_seq_id) {
          ordersMap.get(row.order_id).order_items.push({
            order_item_seq_id: row.order_item_seq_id,
            product_id: row.product_id,
            item_description: row.item_description,
            quantity: row.quantity,
            unit_amount: row.unit_amount,
            item_type_enum_id: row.item_type_enum_id,
          });
        }
      });
  
      // Convert map values to an array
      const orders = Array.from(ordersMap.values());
      console.log("Order Data get successfully");
      return res.status(200).json({ orders });
    });
  };
  
  // API to get  particular orders basis on the Order_id --------------------------------------------------------------------------------
  
  
exports.getorder= (req, res) => {
    const Order_id=req.params.orderid;
    if(!Order_id)
    {
      return res.send("require order_id");
    }
    const selectQuery = `
      SELECT
        oh.order_id,
        oh.order_name,
        oh.placed_date,
        oh.approved_date,
        oh.status_id,
        oh.party_id,
        oh.currency_uom_id,
        oh.product_store_id,
        oh.sales_channel_enum_id,
        oh.grand_total,
        oh.completed_date,
        oi.order_item_seq_id,
        oi.product_id,
        oi.item_description,
        oi.quantity,
        oi.unit_amount,
        oi.item_type_enum_id
      FROM
        order_header oh
        LEFT JOIN order_item oi ON oh.order_id = oi.order_id where oh.order_id= ?
    `;
  
    db.query(selectQuery, [Order_id],(err, results) => {
      if (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const ordersMap = new Map();
  
      // Process the SQL results to format the response
      results.forEach((row) => {
        if (!ordersMap.has(row.order_id)) {
          // If order not in map, add it
          ordersMap.set(row.order_id, {
            order_id: row.order_id,
            order_name: row.order_name,
            placed_date: row.placed_date,
            approved_date: row.approved_date,
            status_id: row.status_id,
            party_id: row.party_id,
            currency_uom_id: row.currency_uom_id,
            product_store_id: row.product_store_id,
            sales_channel_enum_id: row.sales_channel_enum_id,
            grand_total: row.grand_total,
            completed_date: row.completed_date,
            order_items: [],
          });
        }
  
        // Add order item details to the order
        if (row.order_item_seq_id) {
          ordersMap.get(row.order_id).order_items.push({
            order_item_seq_id: row.order_item_seq_id,
            product_id: row.product_id,
            item_description: row.item_description,
            quantity: row.quantity,
            unit_amount: row.unit_amount,
            item_type_enum_id: row.item_type_enum_id,
          });
        }
      });
  
      // Convert map values to an array
      const orders = Array.from(ordersMap.values());
      console.log("Order Data get successfully");
      return res.status(200).json({ orders });
    });
  };
  
  //Api for Order_Update-----------------------------------------------------------------------------------------------------------------------------
  
exports.orderupdate= (req, res) => {
    try {
      const orderid = req.params.orderid;
      const data = req.body;
  console.log(orderid,data);
      if (!data || !orderid) {
        return res.status(400).json({ error: "Both ORDERID and UPDATEDATA are required." });
      }
       
         const updatequery = 'UPDATE order_header SET ? WHERE order_id = ?';
  
      db.query(updatequery, [data, orderid], (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Internal Server Error",
            details: err
          });
        }
        const finddata='select *from order_header where order_id = ?'
        db.query(finddata, [orderid], (err, results) => {
               if(err)
               {
                return res.status(500).json({error:"data not fetch"});
               }
               return res.status(200).json({
                message: "Data updated successfully",
                results
            });
          })
  
        
      });
  
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };