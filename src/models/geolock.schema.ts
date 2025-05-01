import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document, Schema as MongooseSchema } from 'mongoose';

export type GeolockDocument = Geolock & Document;

export type GeolockType = 'country' | 'city' | 'radius';

@Schema({ timestamps: true })
export class Geolock {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Capsule', required: true })
  capsuleId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: ['country', 'city', 'radius'] })
  type: GeolockType;

  @Prop()
  countryCode: string;

  @Prop()
  cityName: string;

  @Prop({
    type: {
      lat: Number,
      lng: Number,
      radiusMeters: Number,
    },
  })
  coordinates: {
    lat: number;
    lng: number;
    radiusMeters: number;
  };

  @Prop()
  createdAt: Date;
}

export const GeolockSchema = SchemaFactory.createForClass(Geolock);
