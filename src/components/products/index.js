import React, { Component } from "react";
import { connect } from 'react-redux';
import { getAllProducts } from '../../actions/index.js';
import ProductItem from "./product_item";
import './products.css';
import "bootstrap/dist/css/bootstrap.css";

class Products extends Component {
    goToDetails = id => {
        this.props.history.push(`/products/${id}`);
      };
    
      componentDidMount = () => {
        this.props.getAllProducts();
      };
    render() {
        const { products } = this.props;
        const productElements = products.map(product => {
          return <ProductItem key={product.id} {...product} goToDetails={() => this.goToDetails(product.id)} />;
        });

        return (
        <div className='products'>
            <div className="products-hero">
                <p className="eyebrow">Current release</p>
                <h1>Wines that carry the story of each block.</h1>
                <p>
                    Limited lots, grown in Orange County's coastal influence and bottled with intention. Tap a bottle to view tasting notes and cellar recommendations.
                </p>
            </div>
            <div className="row mb-3">{productElements}</div>
        </div>
        );
    }
}

function mapStateToProps(state){
  // console.log('Products Component mapStateToProps state:', state);
  
  return {
      products: state.products.list,
      
  };
}

export default connect(
  mapStateToProps,
  {
    getAllProducts,
    
  },
)(Products);
