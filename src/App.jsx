import { useState } from 'react'
import './App.css'

function App() {
  const [vat, setVat] = useState(0)
  const [gp, setGp] = useState(0)
  const [price, setPrice] = useState(0)
  const [discount, setDiscount] = useState(0)

  function handleP(e) {
    let p = parseFloat(e.target.value)
    setPrice(p)
    let g = p - discount
    setGp(g.toFixed(2))
    let v = g * 0.07
    setVat(v.toFixed(2))
  }

  function handleD(e) {
    let d = parseFloat(e.target.value)
    setDiscount(d)
    let g = price - d
    setGp(g.toFixed(2))
    let v = g * 0.07
    setVat(v.toFixed(2))
  }

  return (
    <>
      <p style={{ fontSize: '30pt' }}>Price:
        <input type="number" 
          style={{ fontSize: '30pt' }} 
          onChange={handleP} />
      </p>
      <p style={{ fontSize: '30pt' }}>Discount:
        <input 
          type="number" 
          style={{ fontSize: '30pt' }} 
          onChange={handleD} 
        />
      </p>
      <h1>Gross Price = {gp}</h1>
      <h1>VAT = {vat}</h1>
    </>
  )
}

export default App
