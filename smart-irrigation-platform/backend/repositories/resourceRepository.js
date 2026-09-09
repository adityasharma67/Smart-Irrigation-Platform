const mongoose = require("mongoose");
const { isMongoConnected } = require("../db");
const {
  getInMemoryCollection,
  createInMemoryRecord,
  updateInMemoryRecord,
  removeInMemoryRecord,
} = require("../storage/inMemory");

const clone = (value) => JSON.parse(JSON.stringify(value));

const serialize = (value) => {
  if (!value) return value;
  const plain = typeof value.toObject === "function" ? value.toObject() : clone(value);
  if (plain._id && !plain.id) plain.id = String(plain._id);
  if (plain._id) plain._id = String(plain._id);
  return plain;
};

const matchMemoryFilter = (record, filter) => Object.entries(filter).every(([key, expected]) => {
  if (expected === undefined || expected === null || expected === "") return true;
  return String(record[key]) === String(expected);
});

class ResourceRepository {
  constructor({ collection, Model, defaultSort = { createdAt: -1 } }) {
    this.collection = collection;
    this.Model = Model;
    this.defaultSort = defaultSort;
  }

  usingMongo() {
    return isMongoConnected();
  }

  async list(filter = {}, { limit = 25, skip = 0, sort = this.defaultSort } = {}) {
    if (this.usingMongo()) {
      const [items, total] = await Promise.all([
        this.Model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        this.Model.countDocuments(filter),
      ]);
      return { items: items.map(serialize), total };
    }

    const entries = (getInMemoryCollection(this.collection) || []).filter((record) => matchMemoryFilter(record, filter));
    const [sortKey, sortDirection] = Object.entries(sort)[0] || ["createdAt", -1];
    entries.sort((left, right) => {
      const leftValue = left[sortKey] || "";
      const rightValue = right[sortKey] || "";
      return (leftValue > rightValue ? 1 : leftValue < rightValue ? -1 : 0) * sortDirection;
    });
    return { items: entries.slice(skip, skip + limit).map(clone), total: entries.length };
  }

  async findById(id) {
    if (this.usingMongo()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return serialize(await this.Model.findById(id).lean());
    }
    const item = (getInMemoryCollection(this.collection) || [])
      .find((record) => String(record.id || record._id) === String(id));
    return item ? clone(item) : null;
  }

  async create(data) {
    if (this.usingMongo()) {
      const document = await this.Model.create(data);
      return serialize(document);
    }
    return clone(createInMemoryRecord(this.collection, data));
  }

  async update(id, data) {
    if (this.usingMongo()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const updated = await this.Model.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
      return serialize(updated);
    }
    const updated = updateInMemoryRecord(this.collection, id, data);
    return updated ? clone(updated) : null;
  }

  async remove(id) {
    if (this.usingMongo()) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      return serialize(await this.Model.findByIdAndDelete(id).lean());
    }
    const removed = removeInMemoryRecord(this.collection, id);
    return removed ? clone(removed) : null;
  }
}

module.exports = { ResourceRepository, serialize };
