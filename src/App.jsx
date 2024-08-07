import { useState, useRef } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import QuotationTable from "./QuotationTable";

const products = [
  { code: "p001", name: "Product A", price: 100 },
  { code: "p002", name: "Product B", price: 200 },
  { code: "p003", name: "Product C", price: 150 },
  { code: "p004", name: "Product D", price: 250 },
];

function App() {
  const itemRef = useRef();
  const ppuRef = useRef();
  const qtyRef = useRef();
  const discountRef = useRef();

  const [dataItems, setDataItems] = useState([]);
  const [ppu, setPpu] = useState(products[0].price);

  const addItem = () => {
    const item = products.find((v) => itemRef.current.value === v.code);

    const qty = parseFloat(qtyRef.current.value) || 0;
    const pricePerUnit = parseFloat(ppuRef.current.value) || 0;
    const discount = parseFloat(discountRef.current.value) || 0;

    const amount = pricePerUnit * qty - discount;

    // Find index where item, ppu, discount are the same, and discount is 0
    const existingItemIndex = dataItems.findIndex(
      (v) =>
        v.item === item.name &&
        v.ppu === pricePerUnit &&
        v.discount === 0
    );

    if (existingItemIndex !== -1 && discount === 0) {
      // Merge the items by updating the quantity and amount
      const updatedDataItems = dataItems.map((v, i) => {
        if (i === existingItemIndex) {
          return {
            ...v,
            qty: v.qty + qty,
            amount: v.amount + amount,
          };
        }
        return v;
      });
      setDataItems(updatedDataItems);
    } else {
      // Add new item if discount is not 0 or item is unique
      const newItem = {
        item: item.name,
        ppu: pricePerUnit,
        qty: qty,
        discount: discount,
        amount: amount,
      };
      setDataItems([...dataItems, newItem]);
    }
  };

  const clearDataItems = () => {
    setDataItems([]);
  };

  const deleteByIndex = (index) => {
    const newDataItems = [...dataItems];
    newDataItems.splice(index, 1);
    setDataItems(newDataItems);
  };

  const productChange = () => {
    const item = products.find((v) => itemRef.current.value === v.code);
    setPpu(item.price);
  };

  return (
    <Container>
      <Row>
        <Col md={4} style={{ backgroundColor: "#e4e4e4" }}>
          <Row>
            <Col>
              Item
              <Form.Select ref={itemRef} onChange={productChange}>
                {products.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Price Per Unit</Form.Label>
              <Form.Control
                type="number"
                ref={ppuRef}
                value={ppu}
                onChange={(e) => setPpu(ppuRef.current.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" ref={qtyRef} defaultValue={1} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Discount</Form.Label>
              <Form.Control type="number" ref={discountRef} defaultValue={0} />
            </Col>
          </Row>
          <hr />
          <div className="d-grid gap-2">
            <Button variant="primary" onClick={addItem}>
              Add
            </Button>
          </div>
        </Col>
        <Col md={8}>
          <QuotationTable
            data={dataItems}
            clearDataItems={clearDataItems}
            deleteByIndex={deleteByIndex}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
