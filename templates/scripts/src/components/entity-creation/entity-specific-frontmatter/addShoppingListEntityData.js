async function addShoppingListEntityData(tp, entityData, config) {
    entityData.category = await tp.system.suggester(
        ["Grocery", "Cleaning", "Technology", "Clothing", "Wishlist"], 
        ["grocery", "cleaning", "technology", "clothing", "wishlist"], 
        false, "Category:"
    );
    entityData.items = []; // Will be populated in the template
    
    entityData.tags.push(...config.baseTags, `category/${entityData.category}`);
    
    return entityData;
}
module.exports = addShoppingListEntityData;
