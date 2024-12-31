const Product = Parse.Object.extend("Products");
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", (request) => {
	return "Hello world! loja virtual de renato teste 1";
});

Parse.Cloud.define("get-all-products", async (request) => {
	const query = new Parse.Query(Product);
	const queryResult = await query.find({useMasterkey:true});
	return queryResult.map(function(product){
		product = product.toJSON();
		return {
			id: product.objectId,
			name: product.name,
			unit: product.unit,
			description: product.description,
			price: product.price,
			picture: product.picture != null ? product.picture.url : null
		}
	})

});

Parse.Cloud.define("get-all-products-with-limit", async (request) => {
	const query = new Parse.Query(Product);
	const page = request.params.page;
	const itemsPerPage = request.params.itemsPerPage || 10;
	if(itemsPerPage > 100) throw "quantidade por pagina muito alta"
	query.skip(itemsPerPage * page || 0);
	query.limit(itemsPerPage);
	const queryResult = await query.find({useMasterkey: true});

	return queryResult.map(function (product){
		product = product.toJSON();
		return {
			id: product.objectId,
			name: product.name,
			unit: product.unit,
			description: product.description,
			price: product.price,
			picture: product.picture != null ? product.picture.url : null
		}
	});

});


Parse.Cloud.define("sheach-product-by-name", async (request) => {
	const query = new Parse.Query(Product);
	
	const page = request.params.page;
	const itemsPerPage = request.params.itemsPerPage || 10;
	const name = request.params.name;
	if(name != null){
		query.fullText("name",name);
		//query.matches("name", ".*" + name + ".*");
	}
	if(itemsPerPage > 100) throw "quantidade por pagina muito alta"
	query.skip(itemsPerPage * page || 0);
	query.limit(itemsPerPage)
	query.include("categore");
	const queryResult = await query.find({useMasterkey: true});
	return queryResult.map(function (product){
		product = product.toJSON();
		return {
			id: product.objectId,
			name: product.name,
			unit: product.unit,
			description: product.description,
			price: product.price,
			picture: product.picture != null ? product.picture.url : null,
			category: {
				title: product.categore.title,
				id: product.categore.objectId
			}
		}
	});
	
});