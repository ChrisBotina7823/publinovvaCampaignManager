const helpers = {}

helpers.formatCurrency = value => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    
      return formatter.format(value);
}

helpers.formatNumber = value => {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    
      return formatter.format(value);
}

export default helpers