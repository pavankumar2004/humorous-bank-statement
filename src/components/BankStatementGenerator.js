import React, { useState } from 'react';
import moment from 'moment-timezone'; 
import 'tailwindcss/tailwind.css'; 

// prompt data to generate fun income and expenses.
const humorousPrompts = [
  { id: 1, text: "Coffee addiction support group fee", min: 5, max: 50 },
  { id: 2, text: "Rent for imaginary pet unicorn", min: 100, max: 500 },
  { id: 3, text: "Time machine repair costs", min: 200, max: 1000 },
  { id: 4, text: "Subscription to 'Procrastinators Monthly' (billed yearly)", min: 20, max: 100 },
  { id: 5, text: "Alien language lessons", min: 50, max: 200 },
  { id: 6, text: "Professional pillow fort architect fees", min: 75, max: 300 },
  { id: 7, text: "Bigfoot tracking equipment rental", min: 150, max: 600 },
  { id: 8, text: "Invisible ink for secret diary", min: 10, max: 40 },
  { id: 9, text: "Membership to the Flat Earth Society", min: 30, max: 120 },
  { id: 10, text: "Dragon egg incubator electricity bill", min: 80, max: 350 },
];

// Function to randomly generate humorous financial items.
// Parameters:
// - count: Number of items to generate.
// - isExpense: Boolean to determine if it's an expense (true) or income (false).
const generateHumorousItems = (count, isExpense) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    const prompt = humorousPrompts[Math.floor(Math.random() * humorousPrompts.length)]; // Randomly selecting a prompt.
    const amount = Math.floor(Math.random() * (prompt.max - prompt.min + 1)) + prompt.min; // Random amount within min-max range.
    items.push({
      description: prompt.text,
      amount: isExpense ? -amount : amount // Negative value for expenses, positive for income.
    });
  }
  return items; // Return the list of items generated.
};

// Function to generate a monthly financial statement.
// Parameters:
// - income: Regular monthly income.
// - fixedCosts: Array of user-provided fixed expenses.
// The function also adds random humorous expenses and incomes, then calculates balance.
const generateMonthlyStatement = (income, fixedCosts) => {
  const expenses = [...fixedCosts, ...generateHumorousItems(Math.floor(Math.random() * 3) + 1, true)]; // Fixed and random expenses.
  const additionalIncomes = generateHumorousItems(Math.floor(Math.random() * 2), false); // Random incomes.
  
  // Calculating total income and expenses.
  const totalIncome = income + additionalIncomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const balance = totalIncome - totalExpenses; // Remaining balance.

  return {
    income: [{ description: "Regular Income", amount: income }, ...additionalIncomes], // Adding regular income.
    expenses,
    balance
  };
};

// Component to convert time between different time zones.
const TimezoneConverter = () => {
  const [inputTime, setInputTime] = useState(""); // State for user input time.
  const [fromZone, setFromZone] = useState("America/New_York"); // Default "from" time zone.
  const [toZone, setToZone] = useState("Asia/Kolkata"); // Default "to" time zone.
  const [convertedTime, setConvertedTime] = useState(""); // State to store the converted time.
  const timeZones = moment.tz.names(); // Get all available time zones.

  // Function to handle time conversion based on selected zones.
  const handleConvert = () => {
    const time = moment.tz(inputTime, fromZone); // Create a moment object with the input time and source zone.
    const converted = time.clone().tz(toZone); // Clone the moment object and convert to the target zone.
    setConvertedTime(converted.format("YYYY-MM-DD HH:mm:ss z")); // Format and set the converted time.
  };

  return (
    <div className="card bg-gray-50 shadow-md p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Time Zone Converter</h3>
      <div className="space-y-2">
        {/* Input for date and time */}
        <input
          type="datetime-local"
          value={inputTime}
          onChange={(e) => setInputTime(e.target.value)}
          className="input w-full p-2 border border-gray-300 rounded"
        />
        <div className="flex gap-2">
          {/* Dropdown for selecting source and target time zones */}
          <select value={fromZone} onChange={(e) => setFromZone(e.target.value)} className="w-1/2 p-2 border border-gray-300 rounded">
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
          <select value={toZone} onChange={(e) => setToZone(e.target.value)} className="w-1/2 p-2 border border-gray-300 rounded">
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
        {/* Convert button */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleConvert}>Convert</button>
        {convertedTime && <p className="mt-4">Converted Time: {convertedTime}</p>}
      </div>
    </div>
  );
};

// Component for generating bank statements based on user input and random humorous financial data.
const BankStatementGenerator = () => {
  const [income, setIncome] = useState(''); // State for user-input income.
  const [payPeriod, setPayPeriod] = useState(''); // State for pay period (bi-weekly or twice-monthly).
  const [fixedCosts, setFixedCosts] = useState([{ description: '', amount: '' }]); // State for storing fixed costs entered by the user.
  const [statements, setStatements] = useState([]); // State for storing generated bank statements.

  // Function to handle input changes for fixed costs.
  const handleFixedCostChange = (index, field, value) => {
    const newFixedCosts = [...fixedCosts];
    newFixedCosts[index][field] = value; // Update description or amount for the fixed cost.
    setFixedCosts(newFixedCosts); // Set the updated fixed costs.
  };

  // Function to add another fixed cost input field (limited to 4).
  const addFixedCost = () => {
    if (fixedCosts.length < 4) {
      setFixedCosts([...fixedCosts, { description: '', amount: '' }]); // Add a new empty fixed cost entry.
    }
  };

  // Function to generate monthly financial statements for 12 months.
  const generateStatements = () => {
    // Calculate monthly income based on pay period.
    const monthlyIncome = payPeriod === 'bi-weekly' ? Number(income) * 26 / 12 : Number(income) * 2;

    // Filter out fixed costs that are not fully filled in.
    const validFixedCosts = fixedCosts.filter(cost => cost.description && cost.amount)
      .map(cost => ({ description: cost.description, amount: -Number(cost.amount) })); // Ensure fixed costs are negative (expenses).

    // Generate statements for 12 months.
    const newStatements = Array(12).fill().map(() => generateMonthlyStatement(monthlyIncome, validFixedCosts));
    setStatements(newStatements); // Set the generated statements.
  };

  return (
    <div className="container mx-auto py-8">
      <div className="card bg-white shadow-lg p-6 mb-8 rounded-lg">
        <h3 className="text-2xl font-bold mb-4">Input Your Financial Details</h3>
        <div className="space-y-4">
          {/* Input for monthly income */}
          <input 
            type="number" 
            value={income} 
            onChange={(e) => setIncome(e.target.value)} 
            placeholder="Income"
            className="input w-full p-2 border border-gray-300 rounded"
          />
          {/* Dropdown for selecting pay period */}
          <select onChange={(e) => setPayPeriod(e.target.value)} value={payPeriod} className="w-full p-2 border border-gray-300 rounded">
            <option value="">Select Pay Period</option>
            <option value="bi-weekly">Bi-weekly</option>
            <option value="twice-monthly">Twice a month</option>
          </select>
          {/* Inputs for fixed costs */}
          {fixedCosts.map((cost, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={cost.description}
                onChange={(e) => handleFixedCostChange(index, 'description', e.target.value)}
                placeholder="Cost Description"
                className="w-2/3 p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                value={cost.amount}
                onChange={(e) => handleFixedCostChange(index, 'amount', e.target.value)}
                placeholder="Amount"
                className="w-1/3 p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
          {/* Button to add another fixed cost */}
          <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={addFixedCost}>Add Fixed Cost</button>
          {/* Button to generate bank statements */}
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={generateStatements}>Generate Statements</button>
        </div>
      </div>
      {/* Display generated statements */}
      {statements.length > 0 && (
        <div className="card bg-gray-50 shadow-lg p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Generated Bank Statements</h3>
          {statements.map((statement, index) => (
            <div key={index} className="mb-6">
              <h4 className="text-xl font-semibold mb-2">Month {index + 1}</h4>
              <ul>
                {statement.income.map((item, i) => (
                  <li key={i} className="text-green-500">{item.description}: ${item.amount.toFixed(2)}</li>
                ))}
                {statement.expenses.map((item, i) => (
                  <li key={i} className="text-red-500">{item.description}: ${Math.abs(item.amount).toFixed(2)}</li>
                ))}
              </ul>
              <p className="mt-2 font-semibold">Balance: ${statement.balance.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BankStatementGenerator;
