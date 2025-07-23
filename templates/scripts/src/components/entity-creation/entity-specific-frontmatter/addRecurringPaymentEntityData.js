async function addRecurringPaymentEntityData(tp, entityData, config) {
    entityData.amount = await tp.system.prompt("Amount:", "", true);
    entityData.currency = await tp.system.prompt("Currency (e.g., USD):", "USD", false);
    entityData.frequency = await tp.system.suggester(
        ["Weekly", "Bi-weekly", "Monthly", "Quarterly", "Yearly"], 
        ["weekly", "bi-weekly", "monthly", "quarterly", "yearly"], 
        false, "Frequency:"
    );
    entityData.startDate = await tp.system.prompt("Start date (YYYY-MM-DD):", "", true);
    entityData.endDate = await tp.system.prompt("End date (YYYY-MM-DD, optional):", "", false);
    entityData.category = await tp.system.prompt("Category (e.g., 'subscription', 'utilities'):", "", true);
    entityData.paymentMethod = await tp.system.prompt("Payment method (optional):", "", false);
    entityData.vendor = await tp.system.prompt("Vendor/Company:", "", true);
    entityData.status = await tp.system.suggester(
        ["Active", "Paused", "Cancelled"], 
        ["active", "paused", "cancelled"], 
        false, "Status:"
    );
    
    entityData.tags.push(...config.baseTags, `frequency/${entityData.frequency}`, `category/${entityData.category.toLowerCase().replace(/\s+/g, '-')}`, `status/${entityData.status}`);
    
    return entityData;
}
module.exports = addRecurringPaymentEntityData;
