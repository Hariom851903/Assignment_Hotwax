
const db=require('../database/connection');

// API to insert data into Product table-----------------------------------------------------------------------------------
exports.product=(req, res) => {
    const productData = req.body;
    if(productData)
    {
          
         if(!productData)
         {
            return res.send('please fill require data');
         }
    }
    db.query('INSERT INTO product SET ?', productData, (err, result) => {
      if (err) {
        console.error('Error inserting into Product:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(201).send('Product data inserted successfully');
      }
    });
  };
  


