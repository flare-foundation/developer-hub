import pytest


@pytest.mark.asyncio
async def test_chain_id_coston2():
    from chain_id_coston2 import main

    chain_id = await main()
    assert chain_id == 114


@pytest.mark.asyncio
async def test_chain_id_flare():
    from chain_id_flare import main

    chain_id = await main()
    assert chain_id == 14


@pytest.mark.asyncio
async def test_fetch_abi_coston2():
    from fetch_abi_coston2 import main

    abi = await main()
    assert abi[4]["name"] == "getContractAddressByName"


@pytest.mark.asyncio
async def test_fetch_abi_flare():
    from fetch_abi_flare import main

    abi = await main()
    assert abi[4]["name"] == "getContractAddressByName"


@pytest.mark.asyncio
async def test_ftsov2_consumer_coston():
    from ftsov2_consumer_coston2 import main

    feeds, decimals, timestamp = await main()
    assert len(feeds) == len(decimals)
    assert timestamp > 1717860157


@pytest.mark.asyncio
async def test_make_query_coston2():
    from make_query_coston2 import main

    wnat_addr = await main()
    assert wnat_addr == "0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273"


@pytest.mark.asyncio
async def test_make_query_flare():
    from make_query_flare import main

    wnat_addr = await main()
    assert wnat_addr == "0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d"
