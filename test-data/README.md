# Test Data for CSV Import

This directory contains sample CSV files to test the locked schemas in Admin Console.

## Files

### `leads-sample.csv` 
- **Schema**: 15 columns (locked)
- **Format**: `id,name,phone,email,source,category,service,value,priority,stage,created,apptDate,dueDate,dueTime,notes`
- **Records**: 10 sample leads with varied stages and priorities
- **Usage**: Import via Admin Console → Leads CSV → Import Leads CSV

### `services-sample.csv`
- **Schema**: 4 columns (locked) 
- **Format**: `category,service,price,active`
- **Records**: 5 sample services from different categories
- **Usage**: Import via Admin Console → Pricing & Services → Import CSV

## Testing Instructions

1. **Open Admin Console**: Navigate to `admin.html`
2. **Services Test**:
   - Click "Import CSV" in Pricing & Services section
   - Select `services-sample.csv`
   - Verify 5 services import with correct pricing
   - Export and verify identical CSV format
3. **Leads Test**:
   - Click "Import Leads CSV" in Leads section  
   - Select `leads-sample.csv`
   - Verify 10 leads import with color-coded priority/stage badges
   - Export and verify identical 15-column CSV format

## Schema Validation

Both CSVs are designed to test:
- ✅ Exact header validation
- ✅ Data type conversion (price → number, value → number)
- ✅ Round-trip export compatibility
- ✅ Firestore document creation with correct IDs
- ✅ Table preview rendering

## Notes

- Services CSV only imports `active=true` rows (all 5 rows will import)
- Leads CSV generates IDs if missing (all have IDs, so will use existing)
- Firestore document IDs: Services use service name lowercased-with-dashes, Leads use provided ID
