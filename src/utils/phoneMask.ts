export const phoneMask = (value:string) => {
  if (!value) return ""
  value = value.replace(/\D/g,'')
  value = value.replace(/(\d{2})(\d)/,"($1) $2")
  value = value.replace(/(\d)(\d{4})$/,"$1-$2")
  return value
}

export const phoneNumberRegex = /^\(\d{2}\) \d{5}-\d{4}|\(\d{2}\) \d{4}-\d{4}$/;