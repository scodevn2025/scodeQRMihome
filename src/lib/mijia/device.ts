// Mijia Device - Chuyển đổi từ Python mijiaDevice

import { MijiaDevice, MijiaAPI } from './types';

export class MijiaDeviceWrapper {
  private device: MijiaDevice;
  private api: MijiaAPI;

  constructor(api: MijiaAPI, device: MijiaDevice) {
    this.api = api;
    this.device = device;
  }

  // Device properties
  get id(): string {
    return this.device.id;
  }

  get name(): string {
    return this.device.name;
  }

  get type(): string {
    return this.device.type;
  }

  get model(): string {
    return this.device.model;
  }

  get online(): boolean {
    return this.device.online;
  }

  get homeId(): string {
    return this.device.home_id;
  }

  // Light properties
  get power(): boolean {
    return this.device.properties.power || false;
  }

  set power(value: boolean) {
    this.device.properties.power = value;
  }

  get brightness(): number {
    return this.device.properties.brightness || 0;
  }

  set brightness(value: number) {
    this.device.properties.brightness = Math.max(0, Math.min(100, value));
  }

  get colorTemp(): number {
    return this.device.properties.colorTemp || 4000;
  }

  set colorTemp(value: number) {
    this.device.properties.colorTemp = Math.max(1700, Math.min(6500, value));
  }

  get color(): string {
    return this.device.properties.color || '#ffffff';
  }

  set color(value: string) {
    this.device.properties.color = value;
  }

  // Sensor properties
  get temperature(): number | null {
    return this.device.properties.temperature || null;
  }

  get humidity(): number | null {
    return this.device.properties.humidity || null;
  }

  get pressure(): number | null {
    return this.device.properties.pressure || null;
  }

  // Camera properties
  get recording(): boolean {
    return this.device.properties.recording || false;
  }

  set recording(value: boolean) {
    this.device.properties.recording = value;
  }

  get motionDetection(): boolean {
    return this.device.properties.motionDetection || false;
  }

  set motionDetection(value: boolean) {
    this.device.properties.motionDetection = value;
  }

  get nightVision(): boolean {
    return this.device.properties.nightVision || false;
  }

  set nightVision(value: boolean) {
    this.device.properties.nightVision = value;
  }

  get volume(): number {
    return this.device.properties.volume || 0;
  }

  set volume(value: number) {
    this.device.properties.volume = Math.max(0, Math.min(100, value));
  }

  // Methods
  async turnOn(): Promise<boolean> {
    this.power = true;
    return await this.save();
  }

  async turnOff(): Promise<boolean> {
    this.power = false;
    return await this.save();
  }

  async setBrightness(brightness: number): Promise<boolean> {
    this.brightness = brightness;
    return await this.save();
  }

  async setColor(color: string): Promise<boolean> {
    this.color = color;
    return await this.save();
  }

  async setColorTemp(colorTemp: number): Promise<boolean> {
    this.colorTemp = colorTemp;
    return await this.save();
  }

  async setVolume(volume: number): Promise<boolean> {
    this.volume = volume;
    return await this.save();
  }

  async startRecording(): Promise<boolean> {
    this.recording = true;
    return await this.save();
  }

  async stopRecording(): Promise<boolean> {
    this.recording = false;
    return await this.save();
  }

  async enableMotionDetection(): Promise<boolean> {
    this.motionDetection = true;
    return await this.save();
  }

  async disableMotionDetection(): Promise<boolean> {
    this.motionDetection = false;
    return await this.save();
  }

  async enableNightVision(): Promise<boolean> {
    this.nightVision = true;
    return await this.save();
  }

  async disableNightVision(): Promise<boolean> {
    this.nightVision = false;
    return await this.save();
  }

  private async save(): Promise<boolean> {
    try {
      const response = await this.api.set_devices_prop(this.device);
      return response.success;
    } catch (error) {
      console.error('Failed to save device properties:', error);
      return false;
    }
  }

  async refresh(): Promise<boolean> {
    try {
      const response = await this.api.get_devices_prop(this.device);
      if (response.success && response.data) {
        this.device.properties = { ...this.device.properties, ...response.data };
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh device properties:', error);
      return false;
    }
  }

  // Get all properties
  getProperties(): Record<string, unknown> {
    return { ...this.device.properties };
  }

  // Set multiple properties at once
  async setProperties(properties: Record<string, unknown>): Promise<boolean> {
    Object.assign(this.device.properties, properties);
    return await this.save();
  }
}

// Factory function để tạo device wrapper
export function createMijiaDevice(api: MijiaAPI, device: MijiaDevice): MijiaDeviceWrapper {
  return new MijiaDeviceWrapper(api, device);
}

// Factory function để tạo device wrapper by name
export async function createMijiaDeviceByName(api: MijiaAPI, dev_name: string): Promise<MijiaDeviceWrapper | null> {
  const response = await api.get_device_by_name(dev_name);
  if (response.success && response.data) {
    return new MijiaDeviceWrapper(api, response.data);
  }
  return null;
}
