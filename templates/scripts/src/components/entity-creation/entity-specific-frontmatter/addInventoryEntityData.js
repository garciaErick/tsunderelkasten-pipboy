async function addInventoryEntityData(tp, entityData, config) {
    entityData.location = await tp.system.prompt("Location/Room:", "", true);
    entityData.quantity = await tp.system.prompt("Quantity (optional):", "", false);
    entityData.condition = await tp.system.suggester(
        ["New", "Like New", "Good", "Fair", "Poor"], 
        ["new", "like-new", "good", "fair", "poor"], 
        false, "Condition:"
    );
    entityData.purchaseDate = await tp.system.prompt("Purchase date (YYYY-MM-DD, optional):", "", false);
    entityData.purchasePrice = await tp.system.prompt("Purchase price (optional):", "", false);
    entityData.currentValue = await tp.system.prompt("Current estimated value (optional):", "", false);
    entityData.imageUrl = await tp.system.prompt("Item image URL (optional):", "", false);
    entityData.notes = await tp.system.prompt("Additional notes (optional):", "", false);
    
    entityData.tags.push(...config.baseTags, `location/${entityData.location.toLowerCase().replace(/\s+/g, '-')}`, `condition/${entityData.condition}`);
    
    return entityData;
}
module.exports = addInventoryEntityData;