/* Importe total de las ventas de este mes */
db.sales.aggregate(
    [
    {
        $group:{
            _id:null,
            importe_ventas:{$sum:{$multiply: [ "$price", "$quantity" ] }} 
        }
    }]
);
/*beneficios de cada producto(mostrar solo los productos cuyo beneficio sea mayor a 100) */
db.sales.aggregate(
    [
    {
        $group:{
            _id: "$item",
            Beneficios:{$sum:{$subtract:[{$multiply: [ "$price", "$quantity" ]},{$multiply:["$quantity","$cost"]}] }}
        }
    },
    {
        $match:{"Beneficios":{$gte:100}}

    }
]);
/*beneficio total del mes */
db.sales.aggregate(
    [
    {
        $group:{
            _id: null,
            Beneficios:{$sum:{$subtract:[{$multiply: [ "$price", "$quantity" ]},{$multiply:["$quantity","$cost"]}] }}
        }
    }
]);
/*Numero de ventas realizadas este mes*/
db.sales.aggregate(
    [
    {
        $group:{
            _id:null,
            NumeroDeVentas:{$sum:1}
        }
    }
    ]);
/*Mejor cliente(El que mas dinero haya gastado)*/
db.sales.aggregate(
    [
    {
        $group:{
            _id:"$client",
            MejorCliente:{$sum:{$multiply: [ "$price", "$quantity" ] }}
        }
    },
    {
        $sort:{"MejorCliente":-1}
    }
    ]);
/*Media de dinero que ha ganado la empresa por envio*/
db.sales.aggregate(
    [
    {
        $group:{
            _id: null,
            Dinero_Ganado_Por_Envio:{$avg:{$subtract:[{$multiply: [ "$price", "$quantity" ]},{$multiply:["$quantity","$cost"]}] }}
        }
    }
]);
/*Mejor articulo vendido*/
db.sales.aggregate(
    [
    {
        $group:{
            _id: "$item",
            Mejor_articulo:{$sum:{$subtract:[{$multiply: [ "$price", "$quantity" ]},{$multiply:["$quantity","$cost"]}] }}
        }
    },
    {
        $sort:{"Mejor_articulo":-1}
    }
]);
/*beneficio y cantidad  de articulos vendidos hasta la mitad del mes*/

db.sales.aggregate([
    {
      $match : { "sell_date": { $gte: new ISODate("2020-03-01"), $lt: new ISODate("2020-03-15") } }
    },

    {
      $group : {
         _id : { $dateToString: { format: "%Y-%m-%d", date: "$sell_date" } },
         Beneficio:{$sum:{$subtract:[{$multiply: [ "$price", "$quantity" ]},{$multiply:["$quantity","$cost"]}] }},
         cantidad_de_ventas: {$sum:"$quantity"} ,
         articulo:{$push:"$item"}
      }
    },
    {
      $sort : { beneficio: -1 }
    }
   ])
   /*beneficio y cantidad  de articulos vendidos desde mitad de mes*/
   db.sales.aggregate([
    {
      $match : { "sell_date": { $gte: new ISODate("2020-03-15"), $lt: new ISODate("2020-03-31") } }
    },

    {
      $group : {
         _id : { $dateToString: { format: "%Y-%m-%d", date: "$sell_date" } },
         Beneficio:{$sum:{$subtract:[{$multiply: [ "$price", "$quantity" ]},{$multiply:["$quantity","$cost"]}] }},
         cantidad_de_ventas: {$sum:"$quantity"} ,
         articulo:{$push:"$item"}
      }
    },
    {
      $sort : { beneficio: -1 }
    }
   ])