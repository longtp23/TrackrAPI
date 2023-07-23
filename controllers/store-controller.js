import Store from "../models/Store.js";

export const addStore = async (req, res) => {
  const existingStore = await Store.findOne({ name: req.body.name });
  if (existingStore) {
    return res.status(400).json("Store existed!");
  }
  try {
    const newStore = new Store({
      type: req.body.type,
      name: req.body.name,
      firstPageUrl: {
        ps5: req.body.firstPageUrl.ps5,
        ps5Old: req.body.firstPageUrl.ps5Old,
        ps4: req.body.firstPageUrl.ps4,
        ps4Old: req.body.firstPageUrl.ps4Old,
        ps3: req.body.firstPageUrl.ps3,
        ps2: req.body.firstPageUrl.ps2,
        psVita: req.body.firstPageUrl.psVita,
        psVitaOld: req.body.firstPageUrl.psVitaOld,
        switch: req.body.firstPageUrl.switch,
        switchOld: req.body.firstPageUrl.switchOld,
        DS: req.body.firstPageUrl.DS,
        xbox: req.body.firstPageUrl.xbox,
      },
      nextPageUrl: req.body.nextPageUrl,
      baseUrl: req.body.baseUrl,
      productSelector: req.body.productSelector,
      productTitleSelector: req.body.productTitleSelector,
      productCurrentPriceSelector: req.body.productCurrentPriceSelector,
      productOriginalPriceSelector: req.body.productOriginalPriceSelector,
      productLinkSelector: req.body.productLinkSelector,
      nextPageSelector: req.body.nextPageSelector,
    });

    const savedStore = await newStore.save();
    res.status(200).json(savedStore);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const addStores = async (req, res) => {
  const storesData = req.body.stores; // Assuming the array of stores is passed as "stores" in the request body

  try {
    const existingStores = await Store.find({
      name: { $in: storesData.map((store) => store.name) },
    });
    const existingStoreNames = existingStores.map((store) => store.name);

    const newStores = storesData.filter(
      (store) => !existingStoreNames.includes(store.name)
    );

    if (newStores.length === 0) {
      return res.status(400).json("All stores already exist!");
    }

    const createdStores = await Store.create(newStores);
    res.status(200).json(createdStores);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find()
    res.status(200).json(stores)
    
  } catch (error) {
    res.status(500).json(error)
  }
};
