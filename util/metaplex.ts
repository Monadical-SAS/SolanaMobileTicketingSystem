import {publicKey, PublicKey, Umi} from '@metaplex-foundation/umi';
import {
  fetchAllDigitalAssetByOwner,
  fetchDigitalAsset,
} from '@metaplex-foundation/mpl-token-metadata';
import constants from './constants';
import {
  CandyMachine,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';

const collectionId = constants.PUBLIC_CANDY_MACHINE_ID;

export const fetchNFTData = async (uri: string) => {
  const fetchResult = await fetch(uri);
  return await fetchResult.json();
};

export async function fetchMetadataByMint(
  umi: Umi,
  mintPublicKey: PublicKey,
): Promise<any> {
  try {
    const asset = await fetchDigitalAsset(umi, mintPublicKey);
    const response = await fetch(asset.metadata.uri);
    const metadata = await response.json();
    return {...asset, ...metadata};
  } catch (error) {
    console.error('fetchMetadataByMint', error);
    throw new Error('Error fetching NFT metadata');
  }
}

export async function fetchCandyMachineData(umi: Umi): Promise<CandyMachine> {
  try {
    const candyMachineId = publicKey(collectionId);
    return await fetchCandyMachine(umi, candyMachineId);
  } catch (error) {
    console.error('fetchCandyMachineData', error);
    throw new Error('Error fetching candy machine data');
  }
}

export async function fetchEventsByOwner(umi: Umi): Promise<any[]> {
  try {
    return await fetchAllDigitalAssetByOwner(umi, umi.payer.publicKey);
  } catch (error) {
    console.error('fetchEventsByOwner', error);
    throw new Error('Error fetching my events');
  }
}
