export const fetchNFTData = async (uri: string) => {
  const fetchResult = await fetch(uri);
  return await fetchResult.json();
};
