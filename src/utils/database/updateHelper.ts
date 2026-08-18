export function DbUpdateHelper(arg: { updates: any; id?: string | number }) {
  //Just the ["key = $1", "key =  $2"]
  const setClause = Object.keys(arg.updates)
    .map((key, i) => `"${key}" = $${i + 1}`)
    .join(", ");

  //Just the [value1, value2]
  const values = Object.values(arg.updates);

  //Just the [value1, value2, id]
  //Add Id As the Last value
  if (arg.id) values.push(arg.id);

  return {
    values,
    fields: Object.keys(arg.updates),
    setClause,
    id: values.length,
  };
}
