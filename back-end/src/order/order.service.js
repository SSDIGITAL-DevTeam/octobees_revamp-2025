import {
  findAllServiceCats,
  findServiceCatById,
  insertServiceCat,
  deleteServiceCat,
  editServiceCat,
} from "./order.repository.js";

// findServiceCatByName,

{
  /**
      id             
      amount      
      bussiness   
      category    
      categoryId  
      date        
      email       
      message     
      name        
      phoneNumber 
      plan        
      idPlan      
      time        
      **/
}

export const getAllServiceCat = async (filters) => {
  try {
    const data = await findAllServiceCats();
    return data;
  } catch (error) {
    throw new Error("Gagal Mengambil Seluruh Data Order");
  }
};

export const getServiceCatById = async (id) => {
  try {
    let data = await findServiceCatById(id);
    if (!data) {
      throw new Error("Order tersebut tidak ditemukan");
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createServiceCat = async (payload) => {
  try {
    const newAmount = parseFloat(payload.amount.replace(/[^\d]/g, ""));
    const data = await insertServiceCat({...payload, amount: newAmount});
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteServiceCatById = async (id) => {
  try {
    await findServiceCatById(id);
    await deleteServiceCat(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateServiceCat = async (id, payload) => {
  try {
    const data = await findServiceCatById(id);
    if (!data) {
      throw new Error("Order dengan Id tersebut tidak ditemukan");
    }
    const newAmount = parseFloat(payload.amount.replace(/[^\d]/g, ""));
    await editServiceCat(id, {...payload, amount:newAmount});
  } catch (error) {
    throw new Error(error.message);
  }
};
