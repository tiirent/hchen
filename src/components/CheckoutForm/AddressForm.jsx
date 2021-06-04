import React, { useState, useEffect } from 'react'
import { InputLabel, Select, MenuItem, Button, Grid, Typography, Divider } from '@material-ui/core'
import { useForm, FormProvider } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { commerce } from '../../lib/commerce'

import FormInput from './FormInput'

const AddressForm = ({ checkoutToken, next }) => {
    const [shippingCountries, setCountries] = useState([])
    const [shippingCountry, setCountry] = useState('')
    const [shippingSubdivisions, setSubdivisions] = useState([])
    const [shippingSubdivision, setSubdivision] = useState('')
    const [shippingOptions, setOptions] = useState([])
    const [shippingOption, setOption] = useState('')
    const methods = useForm()

    useEffect(() => {
        const fetchCountries = async (checkoutTokenId) => {
            const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId)
            
            setCountries(countries)
            setCountry(Object.keys(countries)[0])
        }

        fetchCountries(checkoutToken.id)
    }, [])

    useEffect(() => {
        const fetchSubdivisions = async (countryCode) => {
            const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode)
    
            setSubdivisions(subdivisions)
            setSubdivision(Object.keys(subdivisions)[0])
        }

        if (shippingCountry) fetchSubdivisions(shippingCountry)
    }, [shippingCountry])

    useEffect(() => {
        const fetchOptions = async (checkoutTokenId, country, region = null) => {
            const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region })
    
            setOptions(options)
            setOption(options[0].id)
        }
        if (shippingSubdivision) fetchOptions(checkoutToken.id, shippingCountry, shippingSubdivision)
    }, [shippingSubdivision])

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data) => {
                        console.log(data)
                        next({ ...data, shippingCountry, shippingSubdivision, shippingOption })
                    })}>
                    <Typography variant="h6" gutterBottom>
                        Shipping Address
                    </Typography>
                    <Grid container spacing={3}>
                        <FormInput required name="firstName" label="First name" />
                        <FormInput required name="lastName" label="Last name" />
                        <FormInput required name="address1" label="Address" />
                        <FormInput required name="email" label="Email" />
                        <FormInput required name="city" label="City" />
                        <FormInput required name="zip" label="Zip / Postal code" />
                        <Divider />
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e) => setCountry(e.target.value)}>
                                {Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name})).map((country) => (
                                    <MenuItem key={country.id} value={country.id}>
                                        {country.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>State/Subdivision</InputLabel>
                            <Select value={shippingSubdivision} fullWidth onChange={(e) => setSubdivision(e.target.value)}>
                                {Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name})).map((subdivision) => (
                                    <MenuItem key={subdivision.id} value={subdivision.id}>
                                        {subdivision.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e) => setOption(e.target.value)}>
                                {shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})`})).map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button component={Link} to="/cart" variant="outlined">Back to Cart</Button>
                        <Button type="submit" variant="contained" color="primary">Next</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
