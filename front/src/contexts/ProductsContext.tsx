import { createContext, useState, useContext } from "react";

export interface Product {
    id: number,
    name: string,
    price: number,
    selected: boolean
}


interface ProductsContextType {
    products: Product[],
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>
}

const ProductsContext = createContext<undefined | ProductsContextType>(undefined);

const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const initialList: Product[] = [
        { id: 0, name: "copo", price: 20.00, selected: false },
        { id: 1, name: "prato", price: 30.00, selected: false },
        { id: 2, name: "taça", price: 50.00, selected: false },
        { id: 3, name: "colher", price: 10.00, selected: false },
        { id: 4, name: "garfo", price: 10.00, selected: false },
    ]
    const [products, setProducts] = useState(initialList);



    return (
        <ProductsContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error("useProducts deve ser usado dentro de um ProductsProvider");
    }
    return context;
};

export default ProductsProvider;