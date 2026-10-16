/**
 * Lightweight, strictly typed Minecraft NBT (Named Binary Tag) parser.
 * Reads big-endian binary buffers unzipped from player inventories.
 */

export type NbtValue =
  | number
  | bigint
  | string
  | boolean
  | NbtValue[]
  | { [key: string]: NbtValue };

export interface NbtCompound {
  [key: string]: NbtValue;
}

export class NbtReader {
  private offset = 0;
  private view: DataView;
  private buffer: Uint8Array;
  private decoder = new TextDecoder('utf-8');

  constructor(buffer: Uint8Array) {
    this.buffer = buffer;
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  public readRoot(): NbtCompound {
    if (this.buffer.length === 0) return {};
    const rootType = this.readByte();
    if (rootType === 0) return {}; // TAG_End
    if (rootType !== 10) {
      throw new Error(`Expected root TAG_Compound (10), got ${rootType}`);
    }
    // Root tag name
    this.readString();
    return this.readCompoundPayload();
  }

  private readByte(): number {
    const val = this.view.getInt8(this.offset);
    this.offset += 1;
    return val;
  }

  private readShort(): number {
    const val = this.view.getInt16(this.offset, false);
    this.offset += 2;
    return val;
  }

  private readInt(): number {
    const val = this.view.getInt32(this.offset, false);
    this.offset += 4;
    return val;
  }

  private readLong(): bigint {
    const val = this.view.getBigInt64(this.offset, false);
    this.offset += 8;
    return val;
  }

  private readFloat(): number {
    const val = this.view.getFloat32(this.offset, false);
    this.offset += 4;
    return val;
  }

  private readDouble(): number {
    const val = this.view.getFloat64(this.offset, false);
    this.offset += 8;
    return val;
  }

  private readString(): string {
    const len = this.view.getUint16(this.offset, false);
    this.offset += 2;
    if (len === 0) return '';
    const slice = this.buffer.subarray(this.offset, this.offset + len);
    this.offset += len;
    return this.decoder.decode(slice);
  }

  private readCompoundPayload(): NbtCompound {
    const result: NbtCompound = {};
    while (this.offset < this.buffer.length) {
      const tagType = this.readByte();
      if (tagType === 0) break; // TAG_End
      const tagName = this.readString();
      result[tagName] = this.readTagValue(tagType);
    }
    return result;
  }

  private readListPayload(): NbtValue[] {
    const elemType = this.readByte();
    const length = this.readInt();
    if (length <= 0) return [];
    const list: NbtValue[] = [];
    for (let i = 0; i < length; i++) {
      list.push(this.readTagValue(elemType));
    }
    return list;
  }

  private readTagValue(tagType: number): NbtValue {
    switch (tagType) {
      case 1:
        return this.readByte();
      case 2:
        return this.readShort();
      case 3:
        return this.readInt();
      case 4:
        return this.readLong();
      case 5:
        return this.readFloat();
      case 6:
        return this.readDouble();
      case 7: {
        const len = this.readInt();
        const arr: number[] = [];
        for (let i = 0; i < len; i++) arr.push(this.readByte());
        return arr;
      }
      case 8:
        return this.readString();
      case 9:
        return this.readListPayload();
      case 10:
        return this.readCompoundPayload();
      case 11: {
        const len = this.readInt();
        const arr: number[] = [];
        for (let i = 0; i < len; i++) arr.push(this.readInt());
        return arr;
      }
      case 12: {
        const len = this.readInt();
        const arr: bigint[] = [];
        for (let i = 0; i < len; i++) arr.push(this.readLong());
        return arr;
      }
      default:
        throw new Error(`Unsupported NBT tag type: ${tagType} at offset ${this.offset}`);
    }
  }
}
