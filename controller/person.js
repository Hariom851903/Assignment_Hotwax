const db=require('../database/connection');
// 1. Create Person--------------------------------------------------------------------------------------------------------
// API to insert data into Person table
 exports.personcontroller =(req, res) => {
    try {
      const personData = req.body;
      const partyId = personData.party_id;
  
      if (!partyId) {
        return res.status(400).send('Please fill the party id');
      }
  
      // Check if the party_id exists in the party table
      const partyQuery = `SELECT * FROM party WHERE party_id = ?`;
      
   db.query(partyQuery, [partyId],(err,results)=>{
       if(err)
       {
        return res.status(500).send('Internal server error');
       }
       else{
          if(results.length==0)
          {
             return res.status(404).send('party data not found');
          }
          else{
                // Check if the party_id already exists in the person table
      const personQuery = 'SELECT * FROM person WHERE party_id = ?';
  
      db.query(personQuery, [partyId],(err,existingPerson)=>{
     if(err)
     {
        res.send('Internal server error');
     }
     else{
      if (existingPerson.length > 0) {
        return res.status(400).send('Party id already present in the person table. Please use a different party_id');
      }
      else{
        const insertPersonQuery = 'INSERT INTO person SET ?';
          db.query(insertPersonQuery, personData);
  
       res.status(201).send('person data inserted successfully');
  
      }
     }
  });
  
   }
       }
   });
     
     
  
    
    } catch (error) {
      console.error('Error inserting into Person:', error);
      res.status(500).send('Internal Server Error');
    }
  }