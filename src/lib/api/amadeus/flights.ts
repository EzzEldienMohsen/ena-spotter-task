import axiosInstance from '../axios-instance';
import { SearchParams } from '@/types/search';
import { Flight } from '@/types/flight';
import { parseAmadeusResponse } from '@/lib/utils/flight-parser';
import { AmadeusSearchRequest, AmadeusFlightSearchResponse } from '@/types/amadeus';
import { AxiosError } from 'axios';

export async function searchFlightsAPI(params: SearchParams): Promise<Flight[]> {
  try {
    const requestBody: AmadeusSearchRequest = {
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departureDate,
      adults: params.passengers.adults,
      travelClass: params.cabinClass,
      nonStop: false,
      max: 50,
    };

    if (params.returnDate) {
      requestBody.returnDate = params.returnDate;
    }

    if (params.passengers.children > 0) {
      requestBody.children = params.passengers.children;
    }

    if (params.passengers.infants > 0) {
      requestBody.infants = params.passengers.infants;
    }

    const response = await axiosInstance.get<AmadeusFlightSearchResponse>('/v2/shopping/flight-offers', {
      params: requestBody,
    });

    if (!response.data || !response.data.data) {
      return [];
    }

    return parseAmadeusResponse(response.data.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Flight search error:', axiosError.response?.data || axiosError.message);

    if (axiosError.response?.status === 400) {
      throw new Error('Invalid search parameters. Please check your input.');
    } else if (axiosError.response?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    } else if (axiosError.response?.status === 500) {
      throw new Error('Amadeus API service error. Please try again.');
    } else {
      throw new Error('Failed to search flights. Please try again.');
    }
  }
}
