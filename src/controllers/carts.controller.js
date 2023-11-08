import { CartService, purchaseService } from "../services/carts.service.js";
import { ProductService } from "../services/products.service.js";
import { devLogger } from "../utils/logger.js";

export const addCartController = async (req, res) => {
  try {
    const result = await CartService.addCart(req);
    res.createdSuccess(result);
  } catch (error) {
    devLogger.error(error);
    return res.sendServerError(error.message);
  }
};

export const addProductToCartController = async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await ProductService.getById(pid);
    if (!product) {
      return res.sendRequestError("Invalid product");
    }
    const cid = req.params.cid;
    const cart = await CartService.getCart(cid);
    if (!cart) {
      return res.sendRequestError("Invalid cart");
    }

    const currentUser = req.user.user;
    if (currentUser.role === "premium" && product.owner === currentUser._id)
      return res.sendUserError(
        "Premium users cannot add their own products to the cart."
      );

    const existingProduct = cart.products.findIndex(
      (item) => item.product._id == pid
    );
    if (existingProduct !== -1) {
      cart.products[existingProduct].quantity += 1;
    } else {
      const newProduct = {
        product: pid,
        quantity: 1,
      };
      cart.products.push(newProduct);
    }
    const result = await CartService.updatedCart({ _id: cid }, cart);
    return res.sendSuccess(result);
  } catch (error) {
    devLogger.error(error);
    return res.sendServerError(error.message);
  }
};

export const getCartController = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const result = await CartService.getCart(cartId);
    if (!result)
      return res.sendRequestError(`The cart with id ${cartId} does not exist`);
    return res.sendSuccess(result);
  } catch (error) {
    devLogger.error(error);
    return res.sendServerError(error.message);
  }
};

export const updateProductToCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await CartService.getCart(cid);
    if (!cart) return res.sendRequestError("Invalid cart");

    const pid = req.params.pid;
    const existingProduct = cart.products.findIndex(
      (item) => item.product._id == pid
    );
    if (existingProduct === -1) return res.sendRequestError("Invalid product");
    const quantity = req.body.quantity;
    if (!Number.isInteger(quantity) || quantity < 0)
      return res.sendUserError("Quantity must be a positive integer");
    cart.products[existingProduct].quantity = quantity;
    const result = await CartService.updatedCart({ _id: cid }, cart);
    return res.sendSuccess(result);
  } catch (error) {
    devLogger.error(error);
    return res.sendServerError(error.message);
  }
};

export const updatedCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await CartService.getCart(cid);
    if (!cart) return res.sendRequestError("Invalid cart");
    const products = req.body.products;
    if (!Array.isArray(products))
      return res.sendUserError("The product array format is invalid");
    cart.products = products;

    const result = await CartService.updatedCart({ _id: cid }, cart);
    console.log(result.products);

    return res.sendSuccess(result);
  } catch (error) {
    devLogger.error(error);
    return res.sendServerError(error.message);
  }
};

export const deleteCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const result = await CartService.deleteCart(cid);
    if (!result) {
      return res.sendRequestError("Invalid cart");
    }
    res.sendSuccess(result);
  } catch (error) {
    devLogger.error(error);
    return res.sendServerError(error.message);
  }
};

export const deleteProductInCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await CartService.getCart(cid);
    if (!cart) return res.sendRequestError("Invalid cart");
    const pid = req.params.pid;
    const existingProduct = cart.products.findIndex(
      (item) => item.product._id == pid
    );
    if (existingProduct === -1) return res.sendRequestError("Invalid product");

    cart.products.splice(existingProduct, 1);
    await CartService.updatedCart({ _id: cid }, cart);
    const result = await CartService.getCart(cid);
    res.sendSuccess(result);
  } catch (error) {
    devLogger.error(error);
    return res.sendServerError(error.message);
  }
};

export const getPurchaseController = async (req, res) => {
  try {
    const result = await purchaseService(req, res);
    return result;
  } catch (error) {
    devLogger.error(error);
    return res.sendServerError(error.message);
  }
};
